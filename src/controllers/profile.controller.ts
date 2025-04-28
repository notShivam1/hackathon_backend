import { Request, Response } from "express";
import prisma from "../prisma";

export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { fullName, resume } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      await prisma.profile.update({
        where: { userId },
        data: { fullName, resume },
      });
      return res.json({ message: "Profile updated" });
    } else {
      await prisma.profile.create({
        data: {
          fullName,
          resume,
          userId,
        },
      });
      return res.status(201).json({ message: "Profile created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save profile" });
  }
};
