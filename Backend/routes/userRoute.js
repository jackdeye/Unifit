import express from "express";
import db from "../connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";

// Router is an instance of the express router.
const router = express.Router();
const upload = multer();

router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  });
  
  // Get a single user by id
  router.get("/:id", async (req, res) => {
    let collection = await db.collection("users");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
  
    if (!result) res.send("Post not found").status(404);
    else res.send(result).status(200);
  });

  // Create a new user
router.post("/upload", upload.any(), async (req, res) => {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).send("Username and password are required");
      }
  
      //const image = req.files.find(file => file.mimetype.startsWith('image/'));
      /*if (!image) {
        return res.status(400).send("Image file is required.");
      }
     */

      //const base64Image = image.buffer.toString("base64");
      const newDocument = {
        username: req.body.username,
        password: req.body.password,
        //image: base64Image,
      };
  
      let collection = db.collection("users");
      let result = await collection.insertOne(newDocument);
      
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding user");
    }
  });
  
  export default router;