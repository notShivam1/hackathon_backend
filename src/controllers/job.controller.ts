import { Request, Response } from "express";
import prisma from "../prisma";
import { generateEmbedding } from "../utils/embedding";
import { cosineSimilarity } from "../utils/cosine";
import { extractKeywords } from "../utils/extractKeywords";

export const createJob = async (req: Request, res: Response) => {
  try {
    const employerId = req.user?.userId;
    const { title, description, requirements } = req.body;

    if (!employerId) return res.status(401).json({ message: "Unauthorized" });

    const jobText = `${title} ${description} ${requirements}`;
    const jobEmbedding = await generateEmbedding(jobText);
    const jobKeywords = extractKeywords(jobText);

    const newJob = await prisma.job.create({
      data: {
        employerId,
        title,
        description,
        requirements,
        vector: JSON.stringify(jobEmbedding),
      },
    });

    const candidates = await prisma.profile.findMany({
      include: { user: true },
      where: { vector: { not: null } },
    });

    const matches = candidates.map((profile) => {
      const resumeVector = JSON.parse(profile.vector!);
      const resumeText = profile.resume?.toLowerCase() || "";

      let score = cosineSimilarity(jobEmbedding, resumeVector);

      // Add keyword-based boosting (e.g. 0.01 per match)
      for (const keyword of jobKeywords) {
        if (resumeText.includes(keyword)) {
          score += 0.01;
        }
      }

      return {
        candidateId: profile.userId,
        fullName: profile.fullName,
        email: profile.user.email,
        score: Math.round(score * 100),
      };
    });

    matches.sort((a, b) => b.score - a.score);

    for (const match of matches) {
      await prisma.resumeMatch.create({
        data: {
          candidateId: match.candidateId,
          jobId: newJob.id,
          score: match.score,
        },
      });
    }

    return res.status(201).json({ message: "Job posted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post job" });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const employerId = req.user?.userId;
    if (!employerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await prisma.job.findMany({
      where: { employerId },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
