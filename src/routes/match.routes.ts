import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware";
import { getCandidateMatches } from "../controllers/candidateMatch.controller";
import { getMatchesForJob } from "../controllers/employerMatch.controller";

const router = Router();
// @ts-ignore
router.get("/candidate", protect, authorize("CANDIDATE"), getCandidateMatches);
// @ts-ignore
router.get("/job/:id", protect, authorize("EMPLOYER"), getMatchesForJob);

export default router;
