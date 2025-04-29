import { Router } from "express";
import { createOrUpdateProfile } from "../controllers/profile.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();
// @ts-ignore
router.post("/", protect, authorize("CANDIDATE"), createOrUpdateProfile);

export default router;
