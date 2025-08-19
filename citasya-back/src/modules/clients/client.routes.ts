import { Router } from 'express';
import { ClientController } from './client.controller.js';

const router = Router();
const clientController = new ClientController();

// Rutas para la gestión de clientes
router.get('/', (req, res) => clientController.getAllClients(req, res));
router.get('/:id', (req, res) => clientController.getClientById(req, res));
router.post('/', (req, res) => clientController.createClient(req, res));
router.put('/:id', (req, res) => clientController.updateClient(req, res));
router.delete('/:id', (req, res) => clientController.deleteClient(req, res));

export default router;
