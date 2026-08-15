import { type Request, type Response } from "express";
import { Router } from "express";
const courses = Router();

courses.get("/user/purchases", (req: Request, res: Response) => {
  res.json({
    message: "get email",
  });
});

courses.get("/courses", (req: Request, res: Response) => {
  res.json({
    message: "delete endpoints",
  });
});

courses.get("/courses", (req: Request, res: Response) => {
  res.json({
    message: "delete endpoints",
  });
});

courses.get("/courses", (req: Request, res: Response) => {
  res.json({
    message: "delete endpoints",
  });
});

export default courses;
