import { Router } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import prisma from "../prisma";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
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
      let fullName = req.body.fullName?.trim();
      // If no fullName provided, guess from resume
      if (!fullName) {
        const lines = textContent
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        fullName = lines.length > 0 ? lines[0] : "Unnamed";
      }
      await prisma.profile.upsert({
        where: { userId },
        create: { userId, fullName, resume: textContent },
        update: { resume: textContent },
      });

      res.json({ message: "Resume uploaded and parsed successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload or parse resume" });
    }
  }
);

export default router;
