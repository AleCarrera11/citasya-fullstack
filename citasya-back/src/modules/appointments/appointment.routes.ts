import { Router } from 'express';
import { AppointmentsController } from './appointment.controller.js';

const router = Router();
const appointmentsController = new AppointmentsController();

router.get('/', appointmentsController.getAllAppointments);
router.post('/', appointmentsController.createAppointment);
router.patch('/:id/status', appointmentsController.updateStatus);


export default router;
