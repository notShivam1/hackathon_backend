import { Router } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import prisma from "../prisma";
import { protect, authorize } from "../middlewares/auth.middleware";
import { generateEmbedding } from "../utils/embedding";
import { cosineSimilarity } from "../utils/cosine";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  // @ts-ignore
  protect,
  authorize("CANDIDATE"),
  upload.single("file"),
  async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const data = await pdfParse(req.file.buffer);
      const textContent = data.text;

      // Get full name from form data
      let fullName = req.body.fullName?.trim() || "unnamed";

      // 🧠 Generate OpenAI vector
      const embedding = await generateEmbedding(textContent);

      // MATCH AGAINST ALL JOBS
      const jobs = await prisma.job.findMany({
        where: { vector: { not: null } },
      });

      const matches = jobs.map((job) => {
        const jobVector = JSON.parse(job.vector!);
        const score = cosineSimilarity(embedding, jobVector);
        return {
          jobId: job.id,
          title: job.title,
          description: job.description,
          score: Math.round(score * 100),
        };
      });

      matches.sort((a, b) => b.score - a.score);

      // Clear old matches for this candidate
      await prisma.resumeMatch.deleteMany({ where: { candidateId: userId } });

      // Save new matches
      for (const match of matches) {
        await prisma.resumeMatch.create({
          data: {
            candidateId: userId,
            jobId: match.jobId,
            score: match.score,
          },
        });
      }

      // If no fullName provided, guess from resume
      await prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          fullName,
          resume: textContent,
          vector: JSON.stringify(embedding),
        },
        update: {
          fullName,
          resume: textContent,
          vector: JSON.stringify(embedding),
        },
      });

      res.json({ message: "Resume uploaded and parsed successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload or parse resume" });
    }
  }
);

export default router;
