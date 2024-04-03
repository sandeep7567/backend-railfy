import { Router } from "express";
import {
  createTask,
  updateTaskById,
  deleteTaskById,
  deleteAllTasks,
  getAllTasks,
  getTaskById,
} from "../controllers/task.controller";

const router = Router();

router.route("/").post(createTask).delete(deleteAllTasks).get(getAllTasks);

router
  .route("/:id")
  .patch(updateTaskById)
  .delete(deleteTaskById)
  .get(getTaskById);

export default router;
