import { Request, Response } from 'express';
import { AppointmentsService } from './appointment.service.js';

const appointmentsService = new AppointmentsService();

export class AppointmentsController {
    async getAllAppointments(req: Request, res: Response): Promise<Response> {
        try {
            const appointments = await appointmentsService.findAll();
            return res.json(appointments);
        } catch (error) {
            console.error('Error al obtener citas:', error);
            return res.status(500).json({ error: 'Error al obtener citas.' });
        }
    }
}
