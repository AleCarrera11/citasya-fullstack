import { AppDataSource } from "../../data-source.js";
import { Worker } from "./worker.model.js";
import { Service } from "../services/service.model.js";
import { In } from "typeorm";

/**
 * Servicio para operaciones CRUD de trabajadores.
 */
export class WorkerService {
  private workerRepository = AppDataSource.getRepository(Worker);
  private serviceRepository = AppDataSource.getRepository(Service);

  /**
   * Obtiene todos los trabajadores con sus servicios.
   */
  async findAll(): Promise<Worker[]> {
    return this.workerRepository.find({ relations: ["services"] });
  }

  /**
   * Busca un trabajador por su ID, incluyendo servicios.
   */
  async findById(id: number): Promise<Worker | null> {
    return this.workerRepository.findOne({
      where: { id },
      relations: ["services"],
    });
  }

  /**
   * Crea un nuevo trabajador y asocia servicios si se indican.
   */
  async create(workerData: Partial<Worker>): Promise<Worker> {
    const newWorker = this.workerRepository.create(workerData);

    if (Array.isArray(workerData.services) && workerData.services.length > 0) {
      const ids = workerData.services.map((s: any) =>
        typeof s === "object" ? Number(s.id) : Number(s)
      );
      const serviceEntities = await this.serviceRepository.findBy({ id: In(ids) });
      newWorker.services = serviceEntities;
    }

    return this.workerRepository.save(newWorker);
  }

  /**
   * Actualiza los datos de un trabajador y sus servicios.
   */
  async update(id: number, workerData: Partial<Worker>): Promise<Worker> {
    const workerToUpdate = await this.workerRepository.findOne({ where: { id } });

    if (!workerToUpdate) {
      throw new Error("Worker not found");
    }

    this.workerRepository.merge(workerToUpdate, workerData);

    if (Array.isArray(workerData.services) && workerData.services.length > 0) {
      const ids = workerData.services.map((s: any) =>
        typeof s === "object" ? Number(s.id) : Number(s)
      );
      const serviceEntities = await this.serviceRepository.findBy({ id: In(ids) });
      workerToUpdate.services = serviceEntities;
    }

    return this.workerRepository.save(workerToUpdate);
  }

  /**
   * Elimina un trabajador por su ID.
   */
  async delete(id: number): Promise<void> {
    await this.workerRepository.delete(id);
  }
}
