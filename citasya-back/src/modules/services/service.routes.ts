import { Router } from 'express';
import { ServicesController } from './service.controller.js';

const router = Router();
const servicesController = new ServicesController();

router.get('/', servicesController.getAllServices);
router.post('/', servicesController.createService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

export default router;

