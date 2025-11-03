import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import selectionRoutes from "./routes/selections.js";

dotenv.config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || "";

//allows requests from different origins
app.use(cors());
//parses JSON bodies in incoming requests
app.use(express.json());

//health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

//mount the auth and selection routes
app.use("/api/auth", authRoutes);
app.use("/api/selections", selectionRoutes);

//connect to MongoDB and start the server
async function start() {
  try {
    if (!MONGO_URI) {//if the MONGO_URI is not set, show a warning
      console.warn("MONGO_URI is not set");
    } else {
      await mongoose.connect(MONGO_URI);//connect to MongoDB
      console.log("MongoDB connected");
    }
    app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();


