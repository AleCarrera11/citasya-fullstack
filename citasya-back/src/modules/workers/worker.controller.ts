import { Request, Response, NextFunction } from "express";
import { WorkerService } from "./worker.service.js";

export class WorkerController {
  private workerService: WorkerService;

  constructor() {
    this.workerService = new WorkerService();
  }

  /**
   * Obtiene todos los trabajadores.
   * @return JSON con la lista de trabajadores.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workers = await this.workerService.findAll();
      res.json(workers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene un trabajador por su ID.
   * @return JSON con el trabajador encontrado o mensaje de error.
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const worker = await this.workerService.findById(Number(req.params.id));
      if (!worker) {
        res.status(404).json({ message: "Worker not found" });
        return;
      }
      res.json(worker);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crea un nuevo trabajador.
   * @return JSON con el trabajador creado.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newWorkerData = req.body;
      const newWorker = await this.workerService.create(newWorkerData);

      res.status(201).json(newWorker);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza los datos de un trabajador existente.
   * @return JSON con el trabajador actualizado.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updatedWorkerData = req.body;
      const updatedWorker = await this.workerService.update(id, updatedWorkerData);
      res.json(updatedWorker);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Elimina un trabajador por su ID.
   * @return Respuesta vacía si se elimina correctamente.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.workerService.delete(id);
      res.status(204).end(); 
    } catch (error) {
      next(error);
    }
  }
}