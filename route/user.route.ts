import { Router } from "express";
import { registerUser } from "../controller/user.controller";
import { signIn } from "../controller/user.controller";

const router = Router();

router.route("/register").post(registerUser as any);
router.route("/login").post(signIn as any)

export default router;