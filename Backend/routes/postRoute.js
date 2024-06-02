import express from "express";
import db from "../connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import auth from '../middleware/auth.js';

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

// Get post by id
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("posts");
    const query = { _id: new ObjectId(req.params.id) };
    const post = await collection.findOne(query);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post");
  }
});

// Get posts by username
router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const collection = await db.collection("posts");
    const results = await collection.find({ username }).toArray();
    if (!results.length) {
      return res.status(404).send("No posts found for this user");
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts by username");
  }
});

// Get posts by user's school
router.get("/school/:school", async (req, res) => {
  const { schoolName } = req.params;

  try {
    const collection = await db.collection("posts");
    const results = await collection.find({ school : schoolName }).toArray();
    if (!results.length) {
      return res.status(404).send("No posts found for this school");
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts by school");
  }
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

//rent post for a day
router.patch("/:id/rent", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const { date } = req.body;

    const postCollection = db.collection("posts");
    const userCollection = db.collection("users");

    console.log('Received rental request for post:', postId, 'and date:', date);

    if (!date) {
      console.log('Date is required');
      return res.status(400).send("Date is required");
    }

    console.log('Attempting to find post with ID:', postId);
    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      console.log('Post not found');
      return res.status(404).send("Post not found");
    }

    console.log('Post found. Checking availability...');

    // Parse start and end dates
    const startDate = new Date(post.availability[0]);
    const endDate = new Date(post.availability[1]);

    // Parse selected date
    const selectedDate = new Date(date);
    console.log('selectedDates', startDate, selectedDate, endDate);
    // Check if selected date falls within the availability range

    if (selectedDate >= startDate && selectedDate <= endDate) {
      // Check if posts.rented is not empty and selectedDate is not in posts.rented
      if (post.rented && post.rented.length > 0) {
        const rentedDates = post.rented.map(date => new Date(date));
        if (!rentedDates.some(rentedDate => rentedDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0])) {
          console.log('Date available for rental. Updating availability...');
          // add the selected date to posts.rented
          await postCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $push: { rented: selectedDate } }
          );

          // add post to user's rented posts
          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { rentedPosts: new ObjectId(postId) } }
          );
          console.log('Rental confirmed successfully');
          return res.status(200).send("Rental confirmed successfully");
        } else {
          console.log('Date already rented');
          return res.status(400).send("Date already rented");
        }
      } else {
        // If posts.rented is empty, proceed with the rental
        console.log('Date available for rental. Updating availability...');
        // add the selected date to posts.rented
        await postCollection.updateOne(
          { _id: new ObjectId(postId) },
          { $push: { rented: selectedDate } }
        );

        // add post to user's rented posts
        await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { rentedPosts: new ObjectId(postId) } }
        );
        console.log('Rental confirmed successfully');
        return res.status(200).send("Rental confirmed successfully");
      }
    } else {
      console.log('Date not available for rental');
      return res.status(400).send("Date not available for rental");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error confirming rental");
  }
});


// Create a new post
router.post("/upload", auth, upload.any(), async (req, res) => {
  try {
    const { name, desc, isForSale, isForRent, buyPrice, rentPrice, availability, quality, size, username, school } = req.body;
    if (!name || !desc || !req.files || !req.files.length) {
      return res.status(400).send("Name, description, and image are required.");
    }
    
    const image = req.files.find(file => file.mimetype.startsWith('image/'));
    if (!image) {
      return res.status(400).send("Image file is required.");
    }

    const base64Image = image.buffer.toString("base64");

    const newPost = {
      name,
      desc,
      image: base64Image,
      isForSale: isForSale === 'true', // bool conversion
      isForRent: isForRent === 'true', 
      buyPrice: isForSale === 'true' ? buyPrice : null,
      rentPrice: isForRent === 'true' ? rentPrice : null,
      quality,
      size,
      availability: availability ? JSON.parse(availability) : [], // Store as an array of dates
      username,
      school,
      sold: false,
      rented: [],
      comments: [],
    };

    let collection = db.collection("posts");
    await collection.insertOne(newPost);
    
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding post");
  }
});

// Update a post by id
router.patch("/:id", auth, async (req, res) => {
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
router.delete("/:id", auth, async (req, res) => {
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

router.get("/:id/comments", async (req, res) => {
  try {
    const collection = await db.collection("posts");
    const query = { _id: new ObjectId(req.params.id) };
    const post = await collection.findOne(query, { projection: { comments: 1 } });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching comments");
  }
});
router.post("/:id/comments", async (req, res) => {
  try { 
    const { username, comment } = req.body;
    if (!username || !comment){
      return res.status(400).send("Missing either username or comment")
    }
    const query = { _id: new ObjectId(req.params.id) };
    const update = { 
      $push: {
        comments: {
          username, 
          comment
        }
      }
    };
    const collection = await db.collection("posts");
    const result = await collection.updateOne(query, update);

    }
    catch(err) {
      console.error(err);
      res.status(500).send("Unable to add comment");
    }
  }
);


// Like a post by id
router.patch("/:id/likePost", auth, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      //like the post
      post.likes.push(req.userId);
    } else {
      //dislike a post
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    let collection = await db.collection("posts");

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { mew: true});
    let result = await collection.updateOne(query, updatedPost);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error liking/disliking post");
  }
});

// Buy a post
router.patch("/:id/buy", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const postCollection = db.collection("posts");
    const userCollection = db.collection("users");

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.sold) {
      return res.status(400).send("Post is already sold");
    }

    // mark the post as sold
    await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { sold: true } }
    );

    //add post to user's purchased posts
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { purchasedPosts: new ObjectId(postId) } }
    );

    res.status(200).send("Post purchased successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error buying post");
  }
});

export default router;
