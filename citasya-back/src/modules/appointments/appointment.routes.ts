import { Router } from 'express';
import { AppointmentsController } from './appointment.controller.js';

const router = Router();
const appointmentsController = new AppointmentsController();

router.get('/', appointmentsController.getAllAppointments);

export default router;
