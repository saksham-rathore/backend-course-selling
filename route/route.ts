import { Router } from "express";
import { registerUser, signOut } from "../controller/user.controller";
import { signIn } from "../controller/user.controller";
import { VerifyJWT } from "../middleware";

const router = Router();

router.route("/register").post(registerUser as any);
router.route("/login").post(signIn as any);
router.route("/logOut").post(VerifyJWT as any, signOut as any);

export default router;