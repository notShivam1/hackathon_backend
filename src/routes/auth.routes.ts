import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();
// @ts-ignore
router.post("/register", register);
// @ts-ignore
router.post("/login", login);

export default router;
