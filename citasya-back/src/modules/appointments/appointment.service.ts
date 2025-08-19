import { AppDataSource } from "../../data-source.js";
import { Appointment } from "./appointment.model.js";
import { Repository } from "typeorm";

/**
 * Clase de servicio para manejar la lógica de negocio de las citas.
 */
export class AppointmentsService {
    private appointmentRepository: Repository<Appointment>;

    constructor() {
        this.appointmentRepository = AppDataSource.getRepository(Appointment);
    }

    /**
     * Obtiene todas las citas, cargando también los datos de cliente, profesional y servicio.
     */
    async findAll(): Promise<Appointment[]> {
        return this.appointmentRepository.find({
            relations: ["client", "worker", "service"],
            order: { date: "DESC", hour: "DESC" },
            take: 100 // Limita a 100 resultados para evitar sobrecarga
        });
    }
}
