import express from "express";
import db from "../connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";

// Router is an instance of the express router.
const router = express.Router();
const upload = multer();

// Get all the posts (list)
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("posts");
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});


// Get a single post by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("posts");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Post not found").status(404);
  else res.send(result).status(200);
});

router.get("/:id/availability", async (req, res) => {
  try {
    const collection = await db.collection("posts");
    const query = { _id: new ObjectId(req.params.id) };
    const post = await collection.findOne(query, { projection: { availability: 1 } });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json(post.availability);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching availability");
  }
});

// Create a new post
router.post("/upload", upload.any(), async (req, res) => {
  try {
    const { name, desc, isForSale, isForRent, buyPrice, rentPrice, availability } = req.body;
    if (!name || !desc || !req.files || !req.files.length) {
      return res.status(400).send("Name, description, and image are required.");
    }
    
    const image = req.files.find(file => file.mimetype.startsWith('image/'));
    if (!image) {
      return res.status(400).send("Image file is required.");
    }

    const base64Image = image.buffer.toString("base64");

    const newDocument = {
      name,
      desc,
      image: base64Image,
      isForSale: isForSale === 'true', // bool conversion
      isForRent: isForRent === 'true', 
      buyPrice: isForSale === 'true' ? buyPrice : null,
      rentPrice: isForRent === 'true' ? rentPrice : null,
      availability: availability ? JSON.parse(availability) : [], // Store as an array of dates
    };

    let collection = db.collection("posts");
    await collection.insertOne(newDocument);
    
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding post");
  }
});

// Update a post by id
router.patch("/:id", async (req, res) => {
  try {
    const { name, desc, isForSale, isForRent, buyPrice, rentPrice } = req.body;
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name,
        desc,
        isForSale: isForSale === 'true',
        isForRent: isForRent === 'true',
        buyPrice: isForSale === 'true' ? buyPrice : null,
        rentPrice: isForRent === 'true' ? rentPrice : null,
      },
    };

    const collection = db.collection("posts");
    const result = await collection.updateOne(query, updates);
    if (result.matchedCount === 0) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post");
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("posts");
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});

export default router;
