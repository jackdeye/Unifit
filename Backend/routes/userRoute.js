import express from "express";
import db from "../connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Router is an instance of the express router.
const router = express.Router();
const upload = multer();
  
// SignUp - create a new user
router.post("/signup", upload.none(), async (req, res) => {
  // //const { email, password, confirmPassword, firstName, lastName } = req.body;
  // const { username, password } = req.body;

  // try {
  //   if (!username || !password) {
  //     return res.status(400).send("Username and Password are required");
  //   }
  //   const collection = db.collection("users");
  //   const existingUser = await collection.findOne({ username });
  //   if (existingUser) res.send("User already exists.").status(400);

  //   const hashedPassword = await bcrypt.hash(password, 12);
  //   const result = await collection.insertOne({ username, password: hashedPassword });

  //   if (result.insertedId) {
  //     res.status(201).json({ message: "User created successfully", user: { username, id: result.insertedId } });
  //   } else {
  //     res.status(500).send("Something went wrong");
  //   }
    
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Something went wrong");
  // }

  const { username, password, confirmPassword, firstName, lastName } = req.body;

  try {
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).send("Username, Password, First Name, and Last Name are required");
    }
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }
    if (password !== confirmPassword) res.send("Passwords don't match.").status(400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await collection.insertOne({ username, password: hashedPassword, name: `${firstName} ${lastName}` });
    // const token = jwt.sign({ username: result.username, id: result._id }, 'test', { expiresIn: "1h" });

    if (result.insertedId) {
      res.status(201).json({ message: "User created successfully", user: { username, id: result.insertedId } });
      // res.status(201).json({ result, token });
    } else {
      res.status(500).send("Something went wrong");
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }

  //   const hashedPassword = await bcrypt.hash(password, 12);
  //   const result = await User.create({ email, password: hashedPassword, name: '${firstName} ${lastName}' });
  //   const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

  //   res.status(201).json({ result, token });
  //   let collection = db.collection("users");
    
  //   res.sendStatus(204);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Something went wrong");
  // }
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

  
  export default router;