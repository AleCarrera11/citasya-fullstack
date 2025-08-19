import { AppDataSource } from "../../data-source.js";
import { Specialty } from "./specialty.model.js";
import { Repository } from "typeorm";

/**
 * Clase de servicio para manejar la lógica de negocio de las especialidades.
 * Se encarga de toda la interacción con la base de datos a través de TypeORM.
 */
export class SpecialtiesService {
    private specialtyRepository: Repository<Specialty>;

    constructor() {
        this.specialtyRepository = AppDataSource.getRepository(Specialty);
    }

    /**
     * Obtiene todas las especialidades de la base de datos.
     * @returns Una promesa que resuelve con un array de especialidades.
     */
    async findAll(): Promise<Specialty[]> {
        return this.specialtyRepository.find({
            order: { name: "ASC" }
        });
    }

    /**
     * Busca una especialidad por su ID.
     * @param id El ID de la especialidad.
     * @returns Una promesa que resuelve con la especialidad encontrada o null si no existe.
     */
    async findById(id: number): Promise<Specialty | null> {
        return this.specialtyRepository.findOneBy({ id });
    }

    /**
     * Crea una nueva especialidad.
     * @param name El nombre de la nueva especialidad.
     * @returns Una promesa que resuelve con la especialidad creada.
     */
    async create(name: string): Promise<Specialty> {
        const newSpecialty = this.specialtyRepository.create({ name });
        return this.specialtyRepository.save(newSpecialty);
    }

    /**
     * Actualiza una especialidad existente.
     * @param id El ID de la especialidad a actualizar.
     * @param name El nuevo nombre.
     * @returns Una promesa que resuelve con la especialidad actualizada o null si no se encontró.
     */
    async update(id: number, name: string): Promise<Specialty | null> {
        const specialtyToUpdate = await this.specialtyRepository.findOneBy({ id });
        if (!specialtyToUpdate) {
            return null;
        }
        specialtyToUpdate.name = name;
        return this.specialtyRepository.save(specialtyToUpdate);
    }

    /**
     * Elimina una especialidad por su ID.
     * @param id El ID de la especialidad a eliminar.
     * @returns Una promesa que resuelve a true si la especialidad fue eliminada, false de lo contrario.
     */
    async delete(id: number): Promise<boolean> {
        const result = await this.specialtyRepository.delete(id);
        return result.affected !== 0;
    }
}
