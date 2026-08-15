import { type Request, type Response } from "express";
import { Router } from "express";
const userRouter = Router();

userRouter.post("/signup", (req: Request, res: Response) => {
  res.json({
    message: "signup endpoint",
  });
});


userRouter.put("/signin", (req: Request, res: Response) => {
  res.json({
    message: "update",
  });
});


userRouter.put("/purchase", (req: Request, res: Response) => {
  res.json({
    message: "update",
  });
});


userRouter.put("/course", (req: Request, res: Response) => {
  res.json({
    message: "update",
  });
});


export default userRouter;