import express from "express";
import db from "../connection.js";
import multer from "multer";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";

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
    const result = await collection.insertOne({ 
      username, 
      password: hashedPassword, 
      name: `${firstName} ${lastName}`, 
      profilePicture: null, 
      bio: null, 
      purchasedPosts: [],
      rentedPosts: [],
    });

    if (result.insertedId) {
      const token = jwt.sign({ username, id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.status(201).json({ message: "User created successfully", user: { username, id: result.insertedId, name: `${firstName} ${lastName}`, profilePicture: null }, token });
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
    return res.status(200).json({ user: { username: existingUser.username, name: existingUser.name, profilePicture: existingUser.profilePicture }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/editprofile", upload.single('profilePicture'), async (req, res) => {
  const { username, name, bio, password, school } = req.body;

  try {
    const collection = db.collection("users");
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (school) updates.school = school;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updates.password = hashedPassword;
    }
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      updates.profilePicture = base64Image;
    } else {
      updates.profilePicture = null;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await collection.findOne({ _id: new ObjectId(user._id) });
    res.status(200).json({ 
      profilePicture: updatedUser.profilePicture,
      name: updatedUser.name,
      bio: updatedUser.bio,
      school: updatedUser.school,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
