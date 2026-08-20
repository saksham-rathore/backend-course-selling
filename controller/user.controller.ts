import { Router, Request, Response, CookieOptions } from "express";
import userRouter from "../route/route";
import { prisma } from "../lib/prisma";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

function generateAccessToken(user: { id: number; email: string }) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    },
  );
}

function generateRefreshToken(user: { id: number; email: string }) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "1d",
    },
  );
}

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const User = await prisma.user.create({
    data: {
      userName: userName.toLowerCase(),
      email,
      password: hashedPassword,
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
      userName: User.userName,
    },
  });
};

export const signIn = async (
  req: Request<{}, {}, signInBody>,
  res: Response,
): Promise<void> => {
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
    res.status(401).json({ message: "User does not exists" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid user credentials" });
    return;
  }

  // generate access token
  const accessToken = generateAccessToken(user);

  // generate refresh token
  const refreshToken = generateRefreshToken(user);

  // hash refresh token before storing
  const tokenHash = await bcrypt.hash(refreshToken, 10);

  // calculate expiresAt (1 day from now, matching "1d" duration)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  const refreshTokenRecord = await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict"
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: "strict"
    })
    .status(200)
    .json({
      message: "User signed in successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
    });
};

export const signOut = async (req: Request, res: Response) => {
  // Delete all refresh tokens belonging to this user
  await prisma.refreshToken.deleteMany({
    where: {
      userId: req.user.id
    }
  });

  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      { message: "user signOut successfully" }
    );
}

export const RefreshAccessToken = async (req: Request, res: Response) => {
  
}