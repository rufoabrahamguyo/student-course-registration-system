import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import selectionRoutes from "./routes/selections.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/selections", selectionRoutes);

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn("MONGO_URI is not set. Set it in server/.env to enable database.");
    } else {
      await mongoose.connect(MONGO_URI);
      console.log("MongoDB connected");
    }
    app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();


