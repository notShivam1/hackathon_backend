import { Request, Response } from "express";
import prisma from "../prisma";

export const getCandidateMatches = async (req: Request, res: Response) => {
  const candidateId = req.user?.userId;

  try {
    const matches = await prisma.resumeMatch.findMany({
      where: { candidateId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            requirements: true,
          },
        },
      },
      orderBy: { score: "desc" },
    });

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};
