import { Router } from "express";
import jwt from "jsonwebtoken";
import Selection from "../models/Selection.js";

// Create a new router for handling selection routes
const router = Router();

// Get the secret key used to verify JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// This function checks if the user is logged in before allowing them to access routes
function requireAuth(req, res, next) {
  // Step 1: Get the token from the request headers
  const authHeader = req.headers.authorization || "";
  
  // Step 2: Extract the token (format: "Bearer <token>")
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  
  // Step 3: If no token, send error
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  
  // Step 4: Try to verify the token
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Step 5: Extract user ID from token and attach it to the request
    req.userId = payload.sub;
    // Step 6: Allow the request to continue
    next();
  } catch (e) {
    // Step 7: If token is invalid, send error
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Route to save course selections
// POST /api/selections
router.post("/", requireAuth, async (req, res) => {
  try {
    // Step 1: Get the selections from the request body
    const { selections } = req.body;
    
    // Step 2: Check if selections is valid
    if (!Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ message: "Selections must be a non-empty array" });
    }
    
    // Step 3: Save or update selections in database
    // findOneAndUpdate means: find a document, update it, or create if it doesn't exist
    const savedSelections = await Selection.findOneAndUpdate(
      { userId: req.userId },  // Find by user ID
      { userId: req.userId, selections },  // Update with new data
      { upsert: true, new: true }  // Create if not exists, return updated document
    );
    
    // Step 4: Send back the saved data
    return res.status(200).json(savedSelections);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Route to get the current user's course selections
// GET /api/selections/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    // Step 1: Find the selections for this user
    const userSelections = await Selection.findOne({ userId: req.userId });
    
    // Step 2: If selections found, send them back
    // If not found, send empty array
    return res.json(userSelections || { selections: [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;


