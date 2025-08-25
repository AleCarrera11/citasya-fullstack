import { Router } from 'express';
import { SpecialtiesController } from './specialty.controller.js';

const router = Router();
const specialtiesController = new SpecialtiesController();

router.get('/', specialtiesController.getAllSpecialties);
router.post('/', specialtiesController.createSpecialty);
router.put('/:id', specialtiesController.updateSpecialty);
router.delete('/:id', specialtiesController.deleteSpecialty);

export default router;
