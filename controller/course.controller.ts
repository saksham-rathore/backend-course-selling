import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

type createCourses = {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
};

export const createCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title, price, description, imageUrl } = req.body;

  const userId = req.user.id;

  if (!title || !description || !price || !imageUrl) {
    res.status(400).json({
      message: "All fields are required",
    });
    return;
  }

  const Course = await prisma.course.create({
    data: {
      title,
      price,
      description,
      imageUrl,
      userId,
    },
  });

  res.status(201).json({
    message: "Course created successfully",
    Course,
  });
};

export const getAllCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const Courses = await prisma.course.findMany();

  res.status(200).json({ success: true, Courses });
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (Number.isNaN(id)) {
    res.status(400).json({
      message: "Invalid course ID",
    });
    return;
  }

  const getCourse = await prisma.course.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!getCourse) {
    res.status(404).json({
      message: "Course not found",
    });
    return;
  }

  res.status(200).json({ success: true, getCourse });
};

export const UpdateCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  if (Number.isNaN(id)) {
    res.status(400).json({
      message: "Invalid course ID",
    });
    return;
  }

  // const UpdateCourse = await prisma.course.update({
  //   where: {
  //     id: Number(id),
  //   },
  // });

  if (!UpdateCourse) {
    res.status(404).json({
      message: "Course not found",
    });
    return;
  }

  res.status(200).json({ success: true, UpdateCourse });
};
