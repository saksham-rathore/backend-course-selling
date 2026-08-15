import express, { type Express, type Request, type Response } from "express";


const app: Express = express();
const port = 3000;

// route imports
import { registerUser } from "./controller/user.controller.js";

// routes decleration
app.use("/api/registerUser", registerUser as any)

app.listen(port, () => {
  console.log(`your app is listening on port ${port}`);
});