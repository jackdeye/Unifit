import express from "express";
import db from "../connection.js";
import multer from "multer";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Router is an instance of the express router.
const router = express.Router();
const upload = multer();

// SignUp - create a new user
router.post("/signup", upload.none(), async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await collection.insertOne({ username, password: hashedPassword, name: `${firstName} ${lastName}` });

    if (result.insertedId) {
      const token = jwt.sign({ username: result.username, id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
      return res.status(201).json({ message: "User created successfully", user: { username, id: result.insertedId, name: `${firstName} ${lastName}` }, token });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// SignIn
router.post("/signin", upload.none(), async (req, res) => {
  const { username, password } = req.body;

  try {
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username });

    if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
    return res.status(200).json({ user: { username: existingUser.username, name: existingUser.name }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
