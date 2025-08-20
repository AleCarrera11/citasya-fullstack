import { Request, Response } from 'express';
import { ServicesService } from './service.service.js';

const servicesService = new ServicesService();

export class ServicesController {
    async getAllServices(req: Request, res: Response): Promise<Response> {
        try {
            const services = await servicesService.findAll();
            return res.json(services);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            return res.status(500).json({ error: 'Error al obtener servicios.' });
        }
    }

    // Nuevo método para obtener servicios por ID de especialidad
    async getServicesBySpecialtyId(req: Request, res: Response): Promise<Response> {
        const specialtyId = parseInt(req.params.specialtyId);
        if (isNaN(specialtyId)) {
            return res.status(400).json({ message: 'ID de especialidad inválido.' });
        }
        
        try {
            // Se llama al método del servicio para obtener los datos
            const services = await servicesService.findBySpecialtyId(specialtyId);
            return res.status(200).json(services);
        } catch (error) {
            console.error(`Error al obtener servicios para la especialidad con ID ${specialtyId}:`, error);
            return res.status(500).json({ message: 'Error al obtener los servicios de la especialidad.' });
        }
    }

    async createService(req: Request, res: Response): Promise<Response> {
        const serviceData = req.body;
        try {
            const newService = await servicesService.create(serviceData);
            if (!newService) {
                return res.status(400).json({ error: 'Especialidad no válida.' });
            }
            return res.status(201).json(newService);
        } catch (error) {
            console.error('Error al crear un nuevo servicio:', error);
            return res.status(500).json({ error: 'Error al crear el servicio.' });
        }
    }

    async updateService(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const serviceData = req.body;
        try {
            const updatedService = await servicesService.update(parseInt(id), serviceData);
            if (!updatedService) {
                return res.status(404).json({ error: 'Servicio o Especialidad no encontrada.' });
            }
            return res.json(updatedService);
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            return res.status(500).json({ error: 'Error al actualizar el servicio.' });
        }
    }

    async deleteService(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const deleted = await servicesService.delete(parseInt(id));
            if (!deleted) {
                return res.status(404).json({ error: 'Servicio no encontrado.' });
            }
            return res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar el servicio:', error);
            return res.status(500).json({ error: 'Error al eliminar el servicio.' });
        }
    }
}