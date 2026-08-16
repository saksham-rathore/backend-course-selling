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

export const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
): Promise<void> => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

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

  const createdUser = await prisma.user.findUnique({
    where: { id: User.id },
    select: {
      fullName: true,
      userName: true,
      email: true,
    },
  });

  if (!createdUser) {
    res
      .status(409)
      .json({ message: "Something went wrong while registering the user" });
    return;
  }

  res.status(201).json({
    message: "User registered successfully",
  });
};
