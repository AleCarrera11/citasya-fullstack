import { Request, Response, NextFunction } from "express";
import { WorkerService } from "./worker.service.js";

export class WorkerController {
  private workerService: WorkerService;

  constructor() {
    this.workerService = new WorkerService();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workers = await this.workerService.findAll();
      res.json(workers);
    } catch (error) {
      next(error);
    }
  }

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

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("👉 Body recibido en create worker:", req.body);

      const newWorkerData = req.body;
      const newWorker = await this.workerService.create(newWorkerData);
      console.log("✅ Worker creado:", newWorker);

      res.status(201).json(newWorker);
    } catch (error) {
      console.error("❌ Error en WorkerController.create:", error);

      next(error);
    }
  }

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

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.workerService.delete(id);
      res.status(204).end(); // 204 No Content
    } catch (error) {
      next(error);
    }
  }
}