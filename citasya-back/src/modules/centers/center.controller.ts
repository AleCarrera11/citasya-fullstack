import { Request, Response } from 'express';
import { centerService } from '../centers/center.service.js';

export const centerController = {
    async getCenter(req: Request, res: Response) {
        try {
            const centerId = parseInt(req.params.id, 10);
            
            if (isNaN(centerId)) {
                return res.status(400).json({ message: 'Invalid center ID' });
            }

            const center = await centerService.getCenterById(centerId);
            
            if (!center) {
                return res.status(404).json({ message: 'Center not found' });
            }

            return res.status(200).json(center);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async updateCenter(req: Request, res: Response) {
        try {
            const centerId = parseInt(req.params.id, 10);
            const updateData = req.body;

            if (isNaN(centerId)) {
                return res.status(400).json({ message: 'Invalid center ID' });
            }
            
            const updatedCenter = await centerService.updateCenter(centerId, updateData);

            if (!updatedCenter) {
                return res.status(404).json({ message: 'Center not found' });
            }

            return res.status(200).json(updatedCenter);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};