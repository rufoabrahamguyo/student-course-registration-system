import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, idNumber, email, password } = req.body;
    if (!firstName || !lastName || !idNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    //hashes the password before storing it in the database
    const passwordHash = await bcrypt.hash(password, 10);
    //creates a new user in the database with the hashed password 
    const user = await User.create({ firstName, lastName, idNumber, email, passwordHash });
    //returns a success response with the user's ID and email
    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    //gets the email and password from the request body
    const { email, password } = req.body;
    //finds the user in the database with the email
    const user = await User.findOne({ email });
    //if the user is not found, returns an unauthorized response
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    //compares the password with the hashed password in the database
    const ok = await bcrypt.compare(password, user.passwordHash);
    //if the password is incorrect, returns an unauthorized response
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    //creates a JWT token with the user's ID and the secret key
    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: "7d" });
    //returns a success response with the token and the user's information
    return res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;


