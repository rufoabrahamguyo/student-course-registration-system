import { Router } from "express";
import jwt from "jsonwebtoken";
import Selection from "../models/Selection.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const { selections } = req.body;
    if (!Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ message: "Selections must be a non-empty array" });
    }
    const doc = await Selection.findOneAndUpdate(
      { userId: req.userId },
      { userId: req.userId, selections },
      { upsert: true, new: true }
    );
    return res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const doc = await Selection.findOne({ userId: req.userId });
    return res.json(doc || { selections: [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;


