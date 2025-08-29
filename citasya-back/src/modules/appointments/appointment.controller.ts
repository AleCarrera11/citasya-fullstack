import { Request, Response } from "express";
import { AppointmentsService } from "./appointment.service.js";

// Instancia del servicio de citas
const appointmentsService = new AppointmentsService();

/**
 * Controlador para las rutas relacionadas con citas.
 * Gestiona las operaciones de consulta, creación y actualización de citas.
 */
export class AppointmentsController {
  /**
   * Obtiene todas las citas.
   * @param req - Solicitud HTTP
   * @param res - Respuesta HTTP
   * @returns Lista de citas en formato JSON
   */
  async getAllAppointments(req: Request, res: Response): Promise<Response> {
    try {
      const appointments = await appointmentsService.findAll();
      return res.json(appointments);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      return res.status(500).json({ error: "Error al obtener citas." });
    }
  }

  /**
   * Crea una nueva cita.
   * @param req - Solicitud HTTP con los datos de la cita en el cuerpo
   * @param res - Respuesta HTTP
   * @returns La cita creada en formato JSON
   */
  async createAppointment(req: Request, res: Response): Promise<Response> {
    try {
      const { clientDocumentId, serviceId, workerId, date, hour } = req.body;

      // Validación de datos obligatorios
      if (!clientDocumentId || !serviceId || !workerId || !date || !hour) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }

      const appointment = await appointmentsService.createAppointment({
        clientDocumentId,
        serviceId,
        workerId,
        date,
        hour,
      });

      return res.status(201).json(appointment);
    } catch (error) {
      console.error("Error al crear cita:", error);
      return res.status(500).json({ error: "Error al crear cita." });
    }
  }

  /**
   * Actualiza el estado de una cita.
   * @param req - Solicitud HTTP con el ID de la cita y el nuevo estado
   * @param res - Respuesta HTTP
   * @returns La cita actualizada en formato JSON
   */
  async updateStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validación del nuevo estado
      if (!status) {
        return res.status(400).json({ error: "Se requiere el nuevo estado." });
      }

      const updatedAppointment = await appointmentsService.updateStatus(Number(id), status);

      return res.json(updatedAppointment);
    } catch (error) {
      console.error("Error al actualizar estado de cita:", error);
      return res.status(500).json({ error: "Error al actualizar estado de cita." });
    }
  }
}
