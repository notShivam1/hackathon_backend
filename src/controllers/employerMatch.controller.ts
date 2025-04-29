import { Request, Response } from "express";
import prisma from "../prisma";

export const getMatchesForJob = async (req: Request, res: Response) => {
  const employerId = req.user?.userId;
  const jobId = Number(req.params.id);

  try {
    // validate job belongs to this employer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.employerId !== employerId) {
      return res
        .status(403)
        .json({ message: "Not allowed to view matches for this job" });
    }

    const matches = await prisma.resumeMatch.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
              },
            },
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
