import { AppDataSource } from "../../data-source.js";
import { Appointment, AppointmentStatus } from "./appointment.model.js";
import { Client } from "../clients/client.model.js";
import { Worker } from "../workers/worker.model.js";
import { Service } from "../services/service.model.js";
import { Repository } from "typeorm";
import { google } from "googleapis"; 

// Configuración de Google Calendar API
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service_account_key.json';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// Autenticación con Google API
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export class AppointmentsService {
    private appointmentRepository: Repository<Appointment>;
    private clientRepository: Repository<Client>;
    private workerRepository: Repository<Worker>;
    private serviceRepository: Repository<Service>;

    constructor() {
        this.appointmentRepository = AppDataSource.getRepository(Appointment);
        this.clientRepository = AppDataSource.getRepository(Client);
        this.workerRepository = AppDataSource.getRepository(Worker);
        this.serviceRepository = AppDataSource.getRepository(Service);
    }

    /**
     * Obtiene todas las citas de la base de datos.
     */
    async findAll(): Promise<Appointment[]> {
        return this.appointmentRepository.find({
            relations: ["client", "worker", "service"],
            order: { date: "DESC", hour: "DESC" },
            take: 100,
        });
    }

    /**
     * Crea una cita y la registra en Google Calendar.
     */
    async createAppointment(data: {
        clientDocumentId: string;
        serviceId: number;
        workerId: number;
        date: string;
        hour: string;
    }): Promise<Appointment> {
        
        try {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            
            let savedAppointment: Appointment;

            try {
                // 1. Buscar cliente
                const client = await this.clientRepository.findOne({
                    where: { documentId: data.clientDocumentId },
                });
        
                if (!client) {
                    throw new Error("Cliente no encontrado. Verifique el documento de identidad.");
                }
    
                // 2. Buscar el servicio y trabajador
                const service = await this.serviceRepository.findOneBy({ id: data.serviceId });
                const worker = await this.workerRepository.findOneBy({ id: data.workerId });
    
                if (!service) {
                    throw new Error("Servicio no encontrado");
                }
    
                if (!worker) {
                    throw new Error("Especialista no encontrado");
                }
    
                // 3. Crear y guardar la cita en la base de datos
                const appointment = this.appointmentRepository.create({
                    date: new Date(data.date),
                    hour: data.hour,
                    status: AppointmentStatus.Pendiente,
                    client,
                    service,
                    worker,
                });
    
                savedAppointment = await queryRunner.manager.save(appointment);
                
                // 4. Crear el evento en Google Calendar
                // Falta configurar el calculo de hora fin con servicio
                const startDateTime = new Date(`${data.date}T${data.hour}:00`);
                // Se asume que service.minutes_duration existe y es un número
                const duration = service.minutes_duration || 60; 
                const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

                const event = {
                    summary: `Cita Spa: ${service.name} - ${client.name}`,
                    description: `Servicio: ${service.name}\nCliente: ${client.name}\nTeléfono: ${client.phone}\nEspecialista: ${worker.name}`,
                    start: { dateTime: startDateTime.toISOString(), timeZone: 'America/Caracas' },
                    end: { dateTime: endDateTime.toISOString(), timeZone: 'America/Caracas' },
                };

                try {
                    const calendarResponse = await calendar.events.insert({
                        calendarId: CALENDAR_ID,
                        requestBody: event,
                    });
                } catch (calendarError) {
                    // Si el evento de calendario falla, se registra el error pero no se revierte la transacción de la base de datos.
                }

                await queryRunner.commitTransaction();
                return savedAppointment;
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err; 
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza el estado de una cita.
     */
    async updateStatus(id: number, status: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ["client", "worker", "service"]
        });

        if (!appointment) {
            throw new Error("Cita no encontrada");
        }

        appointment.status = status as any; 
        return this.appointmentRepository.save(appointment);
    }
}
