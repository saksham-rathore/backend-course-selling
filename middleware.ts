import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const VerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")

        if (!token) {
            res.status(401).json({ message: "Unauthorized request" })
            return;
        }
        console.log(token)
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: number; email: string };
        console.log(decodedToken)
        
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken?.id
            },
            select: {
                id: true,
                email: true,
                userName: true,
                fullName: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            res.status(401).json({ message: "Invalid access token" })
            return;
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid access token" })
    }
}