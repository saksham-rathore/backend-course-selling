import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const port = 3000;

app.use(express.json());

import { registerUser, signIn } from "./controller/user.controller.js";

app.use("/api/registerUser", registerUser as any);
app.use("/api/signIn", signIn as any);


app.listen(port, () => {
  console.log(`your app is listening on port ${port}`);
});
