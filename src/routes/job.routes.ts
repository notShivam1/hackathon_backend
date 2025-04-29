import { Router } from "express";
import { createJob, getJobs } from "../controllers/job.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();
// @ts-ignore
router.post("/", protect, authorize("EMPLOYER"), createJob);
// @ts-ignore
router.get("/", protect, authorize("EMPLOYER"), getJobs);

export default router;
