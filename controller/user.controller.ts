import { Router, Request, Response } from "express";
import userRouter from "../route/user.route";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type RegisterUserBody = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  User: string;
};

type signInBody = {
  email: string;
  password: string;
  User: string;
  userName: string;
};

type logOutBody = {
  email: string;
  password: string;
};

export const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
): Promise<void> => {

  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    res.status(400).json({ message: "All field required" });
    return;
  }

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [{ userName }, { email }],
    },
  });

  if (existedUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const User = await prisma.user.create({
    data: {
      userName: userName.toLowerCase(),
      email,
      password,
      fullName,
    },
  });

  if (!User) {
    res
      .status(409)
      .json({ message: "Something went wrong while registering the user" });
    return;
  }

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: User.id,
      email: User.email,
      userName: User.name,
    },
  });
};

export const signIn = async (
  req: Request<{}, {}, signInBody>,
  res: Response,
): Promise<void> => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  // send cookie
  const { email, password, userName } = req.body;

  if (!email && !userName) {
    res.status(400).json({ message: "Email or username is required" });
    return;
  }

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ userName }, { email }],
    },
    select: {
      id: true,
      email: true,
      password: true,
      userName: true,
    },
  });

  if (!user) {
    res.status(401).json({ message: "Invalid user credentials" });
    return;
  }

  const isPasswordValid = user.password === password;

  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid user credentials" });
    return;
  }

  res.status(200).json({
    message: "User signed in successfully",
    user: {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
  });
};

// export const logOut = async (
//   req: Request<{}, {}, logOutBody>,
//   res: Response,
// ): Promise<void> => {
//   await
// };
