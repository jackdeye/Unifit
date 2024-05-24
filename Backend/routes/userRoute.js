import express from "express";
import db from "../connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Router is an instance of the express router.
const router = express.Router();
const upload = multer();

router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  });
  
  // SignIn
router.get("/signin", async (req, res) => {
    let collection = await db.collection("users");
    const existingUser = await collection.findOne({ email });
  
    if (!existingUser) res.send("User doesn't exist.").status(404);

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.send("Invalid credentials.").status(400);

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

    res.status(200).json({ result: existingUser, token });
});

  // SignUp - create a new user
router.post("/signup", upload.any(), async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).send("Username, Password, First Name, and Last Name are required");
      }
      const existingUser = await collection.findOne({ email });
      if (existingUser) res.send("User already exists.").status(400);

      if (passowrd !== confirmPassword) res.send("Passwords don't match.").status(400);

      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await User.create({ email, password: hashedPassword, name: '${firstName} ${lastName}' });
      const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

      res.status(201).json({ result, token });
      let collection = db.collection("users");
      
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    }
  });
  
  export default router;