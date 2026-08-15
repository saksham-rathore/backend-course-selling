import { type Request, type Response } from "express";
const { Router } = require("express");
const courses: typeof Router = Router();

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

module.exports = {
  courses: courses,
};
