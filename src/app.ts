import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import jobRoutes from "./routes/job.routes";
import resumeRoutes from "./routes/resume.routes";
import matchesRoutes from "./routes/match.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      "https://hackathon-frontend-odtdczg0x-shivam-tyagis-projects.vercel.app",
    credentials: true, // if using cookies/auth headers
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/matches", matchesRoutes);

app.get("/", (_req, res) => {
  res.send("API running...");
});

export default app;
