import express, { type Express, type Request, type Response } from "express";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

import { registerUser, signIn, signOut } from "./controller/user.controller.js";
import { VerifyJWT } from "./middleware.js";

app.use("/api/registerUser", registerUser as any);
app.use("/api/signIn", signIn as any);
app.use("/api/signOut", VerifyJWT as any, signOut as any);


app.listen(port, () => {
  console.log(`your app is listening on port ${port}`);
});
