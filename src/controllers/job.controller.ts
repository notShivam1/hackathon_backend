import { Request, Response } from "express";
import prisma from "../prisma";

export const createJob = async (req: Request, res: Response) => {
  try {
    const employerId = req.user?.userId;
    const { title, description, requirements } = req.body;

    if (!employerId) return res.status(401).json({ message: "Unauthorized" });

    await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        employerId,
      },
    });

    return res.status(201).json({ message: "Job posted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post job" });
  }
};
