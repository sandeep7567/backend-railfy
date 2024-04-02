import { Router } from "express";
import {
  createTask,
  updateTaskById,
  deleteTaskById,
  deleteTask,
  getTask,
  getTaskById,
} from "../controllers/task.controller";

const router = Router();

router.route("/").post(createTask).delete(deleteTask).get(getTask);

router
  .route("/:id")
  .patch(updateTaskById)
  .delete(deleteTaskById)
  .get(getTaskById);

export default router;
