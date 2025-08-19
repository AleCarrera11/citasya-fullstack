import { Router } from 'express';
import { SpecialtiesController } from './specialty.controller.js';

const router = Router();
const specialtiesController = new SpecialtiesController();

// Define las rutas y asocia los métodos del controlador
router.get('/', specialtiesController.getAllSpecialties);
router.post('/', specialtiesController.createSpecialty);
router.put('/:id', specialtiesController.updateSpecialty);
router.delete('/:id', specialtiesController.deleteSpecialty);

export default router;
