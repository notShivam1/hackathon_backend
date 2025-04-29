import { Router } from "express";
import { createJob, getJobs } from "../controllers/job.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, authorize("EMPLOYER"), createJob);
router.get("/", protect, authorize("EMPLOYER"), getJobs);

export default router;
