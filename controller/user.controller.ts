import { Router, Request, Response } from "express";
import userRouter from "../route/route";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

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

  const transporter = nodemailer.createTransport({
    service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  });

  const sendVerificationEmail = async (
    email: string,
    verificationUrl: string,
  ) => {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
      <h2>Verify your email</h2>

      <p>Click the button below to verify your email address.</p>

      <a href="${verificationUrl}">
        Verify Email
      </a>

      <p>This link will expire soon.</p>
      `,
    });
  };

  if (!sendVerificationEmail) {
    throw new Error("User not getting email")
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
    res.status(401).json({ message: "Invalid user credentials" });
    return;
  }
  console.log("Hash exists:", !!user.password);
  console.log("Hash format:", user.password.startsWith("$2"));

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid);

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

export const signOut = async (
  req: Request<{}, {}, signInBody>,
  res: Response,
): Promise<void> => {};
