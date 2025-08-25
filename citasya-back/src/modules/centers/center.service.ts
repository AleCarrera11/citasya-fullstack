import { AppDataSource } from "../../data-source.js";
import { Center } from "../centers/center.model.js";

export const centerService = {
    async getCenterById(id: number) {
        const centerRepository = AppDataSource.getRepository(Center);
        const center = await centerRepository.findOne({ where: { id: id } });
        return center;
    },

    async updateCenter(id: number, updateData: Partial<Center>) {
        const centerRepository = AppDataSource.getRepository(Center);
        const center = await centerRepository.findOne({ where: { id: id } });
        
        if (!center) {
            return null; 
        }

        const updatedCenter = await centerRepository.save({
            ...center,
            ...updateData,
        });

        return updatedCenter;
    },
};