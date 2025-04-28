import { Router } from "express";
import { createJob } from "../controllers/job.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, authorize("EMPLOYER"), createJob);

export default router;
