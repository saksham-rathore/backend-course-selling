import { type Request, type Response } from "express";
const { Router } = require("express");
const userRouter: typeof Router = Router();


userRouter.post("/user/signup", (req: Request, res: Response) => {
  res.json({
    message: "signup endpoint",
  });
});


userRouter.put("/user/signup", (req: Request, res: Response) => {
  res.json({
    message: "update",
  });
});


userRouter.put("/user/signup", (req: Request, res: Response) => {
  res.json({
    message: "update",
  });
});


userRouter.put("/user/signup", (req: Request, res: Response) => {
  res.json({
    message: "update",
  });
});

export default userRouter;
