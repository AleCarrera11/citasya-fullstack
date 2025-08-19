import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { google } from 'googleapis';
import { AppDataSource } from '../data-source.js';
import { Service, ServiceStatus } from '../modules/services/service.model.js';
import { Client } from '../modules/clients/client.model.js';
import { Appointment, AppointmentStatus } from '../modules/appointments/appointment.model.js';
import { MoreThanOrEqual, Not } from 'typeorm';

// Configuración de Google Calendar API 
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service_account_key.json';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

// Helper para obtener la duración de un servicio con TypeORM
async function getServiceDuration(serviceName: string): Promise<number | null> {
    const serviceRepository = AppDataSource.getRepository(Service);
    const service = await serviceRepository.findOne({
        where: { name: serviceName }
    });
    return service ? service.minutes_duration : null;
}

// Herramientas gestión de citas
// Herramienta para buscar un cliente por su número de teléfono
export const findClientByPhoneTool = new DynamicStructuredTool({
    name: "find_client_by_phone",
    description: "Busca un cliente en la base de datos por su número de teléfono para ver si ya existe.",
    schema: z.object({
        telefono: z.string().describe("El número de teléfono del cliente"),
    }),
    func: async ({ telefono }) => {
        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({
            where: { phone: telefono }
        });
        if (client) {
            return `El cliente ya existe en la base de datos con el nombre: ${client.name} y el ID: ${client.id}.`;
        }
        return "No se encontró un cliente con este número de teléfono.";
    }
});

// Herramienta para crear un nuevo cliente en la BD
export const createClientTool = new DynamicStructuredTool({
    name: "create_client",
    description: "Crea un nuevo registro de cliente en la base de datos. Se usa cuando el cliente es nuevo.",
    schema: z.object({
        nombre_completo: z.string().describe("El nombre completo del cliente"),
        cedula: z.string().describe("El número de cédula del cliente"),
        fecha_nacimiento: z.string().describe("La fecha de nacimiento del cliente en formato YYYY-MM-DD"),
        telefono: z.string().describe("El número de teléfono del cliente"),
    }),
    func: async ({ nombre_completo, cedula, fecha_nacimiento, telefono }) => {
        try {
            const clientRepository = AppDataSource.getRepository(Client);
            const newClient = clientRepository.create({
                name: nombre_completo,
                documentId: cedula,
                // Aquí necesitarías manejar la fecha de nacimiento si la tienes en tu entidad
                phone: telefono
            });
            await clientRepository.save(newClient);
            return `Cliente creado exitosamente con el ID: ${newClient.id}.`;
        } catch (error) {
            console.error("Error al crear el cliente:", error);
            // Manejar error de duplicado (código '23505' en PostgreSQL)
            // No se puede manejar tan fácil con TypeORM de forma genérica, pero se puede hacer con un 'try-catch' y un findOne previo
            return "Hubo un error al crear el cliente en la base de datos. Es posible que el número de cédula ya exista.";
        }
    }
});

// Herramienta para listar servicios disponibles desde la BD
export const listServicesTool = new DynamicStructuredTool({
    name: "list_services",
    description: "Lista los servicios disponibles en el spa para que el cliente pueda elegir.",
    schema: z.object({}),
    func: async () => {
        const serviceRepository = AppDataSource.getRepository(Service);
        const activeServices = await serviceRepository.find({
            where: { status: ServiceStatus.Activo },
            order: { name: "ASC" }
        });
        if (activeServices.length === 0) {
            return "No hay servicios disponibles en este momento.";
        }
        const serviceList = activeServices.map((service, index) => `${index + 1}. ${service.name}`).join('\n');
        return `Nuestros servicios disponibles son:\n${serviceList}`;
    }
});

// Herramienta para obtener detalles de un servicio (precio, duración, descripción)
export const getServiceDetailsTool = new DynamicStructuredTool({
    name: "get_service_details",
    description: "Obtiene la descripción, precio y duración de un servicio específico del spa.",
    schema: z.object({
        servicio: z.string().describe("El nombre del servicio, por ejemplo: 'Masaje Relajante'"),
    }),
    func: async ({ servicio }) => {
        const serviceRepository = AppDataSource.getRepository(Service);
        const service = await serviceRepository.findOne({
            where: { name: servicio } // Cambiado a búsqueda exacta para evitar problemas
        });
        if (!service) {
            return `Lo siento, no pude encontrar detalles sobre el servicio '${servicio}'.`;
        }
        return `Detalles del servicio '${service.name}': Descripción: ${service.description}. Precio: ${service.price} USD. Duración aproximada: ${service.minutes_duration} minutos.`;
    }
});

// Herramienta para verificar si una fecha y hora están disponibles
export const checkAppointmentAvailabilityTool = new DynamicStructuredTool({
    name: "check_appointment_availability",
    description: "Verifica si una fecha y hora están disponibles para un servicio específico. Es un paso obligatorio antes de agendar.",
    schema: z.object({
        servicio: z.string().describe("El nombre del servicio"),
        fecha: z.string().describe("Fecha de la cita en formato YYYY-MM-DD"),
        hora: z.string().describe("Hora de la cita en formato HH:MM")
    }),
    func: async ({ servicio, fecha, hora }) => {
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        
        const startDate = new Date(fecha);
        const endDate = new Date(fecha);
        endDate.setHours(23, 59, 59, 999);

        const existingAppointment = await appointmentRepository.findOne({
            where: {
                date: startDate,
                hour: hora,
                status: Not(AppointmentStatus.Cancelado)
            }
        });

        if (existingAppointment) {
            return "Lo siento, ese horario ya está ocupado en nuestra base de datos local. Por favor, elige otra hora.";
        }

        return `El horario para el servicio '${servicio}' el ${fecha} a las ${hora} está disponible.`;
    }
});


// Herramienta para reservar una cita
export const bookAppointmentTool = new DynamicStructuredTool({
    name: "book_appointment",
    description: "Reserva una cita en el spa. Requiere el ID del cliente, servicio, fecha (YYYY-MM-DD) y hora (HH:MM). Solo usar después de haber confirmado la disponibilidad y los datos del cliente.",
    schema: z.object({
        cliente_id: z.number().describe("El ID del cliente que reserva la cita"),
        servicio: z.string().describe("Tipo de servicio a reservar"),
        fecha: z.string().describe("Fecha de la cita en formato YYYY-MM-DD"),
        hora: z.string().describe("Hora de la cita en formato HH:MM"),
    }),
    func: async ({ cliente_id, servicio, fecha, hora }) => {
        let bookingId = null;
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const serviceRepository = AppDataSource.getRepository(Service);
            const clientRepository = AppDataSource.getRepository(Client);
            const appointmentRepository = AppDataSource.getRepository(Appointment);
            
            const service = await serviceRepository.findOne({ where: { name: servicio } });
            if (!service) {
                return `Lo siento, el servicio '${servicio}' no existe. No se puede agendar.`;
            }

            const client = await clientRepository.findOneBy({ id: cliente_id });
            if (!client) {
                return "Error: No se pudo encontrar el cliente con el ID proporcionado.";
            }

            // Crear y guardar la cita en la DB
            const newAppointment = appointmentRepository.create({
                client: client,
                service: service,
                date: new Date(fecha),
                hour: hora,
                status: AppointmentStatus.Pendiente // Use the correct enum value
            });

            await queryRunner.manager.save(newAppointment);
            bookingId = newAppointment.id;

            // Integración Google Calendar (no cambia)
            const startDateTime = new Date(`${fecha}T${hora}:00`);
            const endDateTime = new Date(startDateTime.getTime() + service.minutes_duration! * 60 * 1000);

            const event = {
                summary: `Cita Spa: ${service.name} - ${client.name}`,
                description: `Servicio: ${service.name}\nCliente: ${client.name}\nTeléfono: ${client.phone}\nReservado via WhatsApp Bot.`,
                start: { dateTime: startDateTime.toISOString(), timeZone: 'America/Caracas' },
                end: { dateTime: endDateTime.toISOString(), timeZone: 'America/Caracas' },
            };

            const calendarResponse = await calendar.events.insert({
                calendarId: CALENDAR_ID,
                requestBody: event,
            });

            await queryRunner.commitTransaction();

            return `¡Cita agendada con éxito para ${client.name}! Un ${service.name} el ${fecha} a las ${hora}. Esperamos verte pronto. ID de cita DB: ${bookingId}.`;
        } catch (dbError: any) {
            await queryRunner.rollbackTransaction();
            console.error("Error al reservar en la DB o Calendar:", dbError);
            return `Lo siento, hubo un problema al reservar la cita. Por favor, inténtalo de nuevo más tarde o revisa los detalles. Error: ${dbError.message}`;
        } finally {
            await queryRunner.release();
        }
    }
});


// Herramienta para listar las citas próximas de un cliente
export const listUserAppointmentsTool = new DynamicStructuredTool({
    name: "list_user_appointments",
    description: "Lista las citas futuras de un cliente usando su número de teléfono.",
    schema: z.object({
        telefono: z.string().describe("El número de teléfono del cliente en formato internacional, ej. '584121234567'"),
    }),
    func: async ({ telefono }) => {
        const clientRepository = AppDataSource.getRepository(Client);
        const client = await clientRepository.findOne({ where: { phone: telefono } });
        
        if (!client) {
            return "No se encontró un cliente con este número de teléfono. No tienes citas próximas agendadas.";
        }

        const appointmentRepository = AppDataSource.getRepository(Appointment);
        
        // Obtener la fecha de hoy sin la hora, para comparar solo la fecha
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointments = await appointmentRepository.find({
            where: {
                client: { id: client.id },
                date: MoreThanOrEqual(today), // Usa el objeto Date directamente
                status: AppointmentStatus.Pendiente // Usa el enum correcto
            },
            relations: ["service"],
            order: { date: "ASC", hour: "ASC" }
        });

        if (appointments.length === 0) {
            return "No tienes citas próximas agendadas.";
        }

        const appointmentsList = appointments.map(app => {
            const formattedDate = app.date.toISOString().split('T')[0];
            return `- Cita #${app.id}: ${app.service.name} el ${formattedDate} a las ${app.hour}`;
        }).join('\n');
        
        return `Tus próximas citas son:\n${appointmentsList}`;
    }
});

// Herramienta para cancelar una cita
export const cancelAppointmentTool = new DynamicStructuredTool({
    name: "cancel_appointment",
    description: "Cancela una cita existente usando el ID de la cita.",
    schema: z.object({
        citaId: z.number().describe("El ID de la cita a cancelar, debe ser un número entero"),
    }),
    func: async ({ citaId }) => {
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        const appointmentToCancel = await appointmentRepository.findOneBy({ id: citaId });
        
        if (!appointmentToCancel) {
            return `Lo siento, no pude encontrar una cita con el ID ${citaId}. Por favor, verifica el número y vuelve a intentarlo.`;
        }
        
        appointmentToCancel.status = AppointmentStatus.Cancelado; // Usa el valor correcto del Enum
        
        try {
            await appointmentRepository.save(appointmentToCancel);
            // Falta cancelar el evento en Google Calendar.
            return `¡Confirmado! La cita con ID ${citaId} ha sido cancelada con éxito.`;
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            return `Lo siento, hubo un problema al cancelar la cita con ID ${citaId}.`;
        }
    }
});