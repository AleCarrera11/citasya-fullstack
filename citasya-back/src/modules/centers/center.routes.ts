import { Router } from 'express';
import { centerController } from '../centers/center.controller.js';

const router = Router();

router.get('/:id', centerController.getCenter);
router.put('/:id', centerController.updateCenter);

export default router;
