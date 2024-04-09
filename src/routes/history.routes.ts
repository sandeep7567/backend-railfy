import { Router } from "express";
import {
  getAllHistoryByTaskId,
  getHistoryByHistoryId,
  deleteAllHistoryByTaskId,
  deleteHistoryByHistoryId,
} from "../controllers/history.controller";

const router = Router();

// route for history
router
.route("/:taskId")
.get(getAllHistoryByTaskId)
.delete(deleteAllHistoryByTaskId);

router.route("/:taskId/:historyId").get(getHistoryByHistoryId).delete(deleteHistoryByHistoryId);

export default router;