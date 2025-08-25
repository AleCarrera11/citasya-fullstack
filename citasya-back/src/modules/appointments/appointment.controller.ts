import { Request, Response } from "express";
import { AppointmentsService } from "./appointment.service.js";

const appointmentsService = new AppointmentsService();

export class AppointmentsController {
  async getAllAppointments(req: Request, res: Response): Promise<Response> {
    try {
      const appointments = await appointmentsService.findAll();
      return res.json(appointments);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      return res.status(500).json({ error: "Error al obtener citas." });
    }
  }

  async createAppointment(req: Request, res: Response): Promise<Response> {
    try {
      const { clientDocumentId, serviceId, workerId, date, hour } = req.body;

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

  async updateStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

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
