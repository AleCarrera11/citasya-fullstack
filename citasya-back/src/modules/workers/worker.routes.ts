import { Router } from "express";
import { WorkerController } from "./worker.controller.js";

const router = Router();
const controller = new WorkerController();

router.post("/", controller.create.bind(controller));
router.get("/:id", controller.getOne.bind(controller)); 
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.get("/", controller.getAll.bind(controller));


export default router;
