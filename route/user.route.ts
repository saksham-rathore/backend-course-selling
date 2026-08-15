import { Router } from "express";
import { registerUser } from "../controller/user.controller";

const router = Router();

router.route("/register").post(registerUser as any);

export default router;