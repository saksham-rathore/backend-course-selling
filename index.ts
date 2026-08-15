import express, { type Express, type Request, type Response } from "express";
import userRouter from "./route/user.route.js";
import courses from "./route/course.route.js";

const app: Express = express();
const port = 3000;

app.use("/signUp", userRouter);
app.use("/course", courses);

app.listen(port, () => {
  console.log(`your app is listening on port ${port}`);
});