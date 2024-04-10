import { Router } from "express";
import {
  getHealthStatus,
} from "../controllers/health.controller";

const router = Router();

// route for history
router
.route("/")
.get(getHealthStatus)

export default router;