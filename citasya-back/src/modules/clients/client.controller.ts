import { Request, Response } from 'express';
import { ClientService } from './client.service.js';

export class ClientController {
    private clientService: ClientService;

    constructor() {
        this.clientService = new ClientService();
    }

    /**
     * @route GET /admin/clients
     * @desc Obtiene una lista de todos los clientes.
     */
    public async getAllClients(req: Request, res: Response): Promise<void> {
        try {
            const clients = await this.clientService.findAllClients();
            res.status(200).json(clients);
        } catch (error) {
            console.error("Error fetching clients:", error);
            res.status(500).json({ message: "Error al obtener los clientes." });
        }
    }

    /**
     * @route GET /admin/clients/:id
     * @desc Obtiene un cliente por su ID, incluyendo su historial de citas.
     */
    public async getClientById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const client = await this.clientService.findClientById(Number(id));

            if (!client) {
                res.status(404).json({ message: "Cliente no encontrado." });
                return;
            }

            // Aquí agregar la lógica para calcular el total invertido

            res.status(200).json(client);
        } catch (error) {
            console.error(`Error fetching client with id ${req.params.id}:`, error);
            res.status(500).json({ message: "Error al obtener el perfil del cliente." });
        }
    }

    /**
     * @route POST /admin/clients
     * @desc Crea un nuevo cliente.
     */
    public async createClient(req: Request, res: Response): Promise<void> {
        try {
            const clientData = req.body;
            const newClient = await this.clientService.createClient(clientData);
            res.status(201).json(newClient);
        } catch (error) {
            console.error("Error creating client:", error);
            res.status(500).json({ message: "Error al crear el cliente." });
        }
    }

    /**
     * @route PUT /admin/clients/:id
     * @desc Actualiza un cliente existente.
     */
    public async updateClient(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const clientData = req.body;
            const updatedClient = await this.clientService.updateClient(Number(id), clientData);

            if (!updatedClient) {
                res.status(404).json({ message: "Cliente no encontrado." });
                return;
            }

            res.status(200).json(updatedClient);
        } catch (error) {
            console.error(`Error updating client with id ${req.params.id}:`, error);
            res.status(500).json({ message: "Error al actualizar el cliente." });
        }
    }

    /**
     * @route DELETE /admin/clients/:id
     * @desc Elimina un cliente.
     */
    public async deleteClient(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.clientService.deleteClient(Number(id));

            if (!result) {
                res.status(404).json({ message: "Cliente no encontrado." });
                return;
            }

            res.status(204).send(); 
        } catch (error) {
            console.error(`Error deleting client with id ${req.params.id}:`, error);
            res.status(500).json({ message: "Error al eliminar el cliente." });
        }
    }
}