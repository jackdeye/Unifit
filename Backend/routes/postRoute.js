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
      comments: [],
      pending: false,
      buyerId: null,
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

router.patch("/:id/request", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const buyerId = req.userId;

    if (!ObjectId.isValid(postId) || !ObjectId.isValid(buyerId)) {
      return res.status(400).send("Invalid postId or buyerId");
    }

    const postCollection = db.collection("posts");
    const userCollection = db.collection("users");

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.pending) {
      return res.status(400).send("Post is already pending");
    }

    await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { pending: true, buyerId: new ObjectId(buyerId) } }
    );

    await userCollection.updateOne(
      { _id: new ObjectId(buyerId) },
      { $push: { pendingPosts: new ObjectId(postId) } }
    );

    const seller = await userCollection.findOne({ username: post.username });
    await userCollection.updateOne(
      { _id: new ObjectId(seller._id) },
      { $push: { pendingRequests: new ObjectId(postId) } }
    );

    res.status(200).send("Post requested successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error requesting post");
  }
});

// Utility function to validate ObjectId
const isValidObjectId = (id) => ObjectId.isValid(id) && new ObjectId(id).toString() === id;

// // Fetch pending requests for a user
// router.get("/pending-requests", auth, async (req, res) => {
//   try {
//     const userId = req.userId;

//     if (!isValidObjectId(userId)) {
//       return res.status(400).send("Invalid userId");
//     }

//     const userCollection = db.collection("users");
//     const postCollection = db.collection("posts");

//     const user = await userCollection.findOne({ _id: new ObjectId(userId) });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     const pendingRequests = user.pendingRequests || [];
//     const pendingPosts = await postCollection.find({ _id: { $in: pendingRequests } }).toArray();

//     const requestsWithBuyers = await Promise.all(pendingPosts.map(async (post) => {
//       const buyer = await userCollection.findOne({ _id: new ObjectId(post.buyerId) });
//       return { ...post, buyerUsername: buyer.username };
//     }));

//     res.status(200).json(requestsWithBuyers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching pending requests");
//   }
// });
router.patch("/:id/accept", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const sellerId = req.user._id;

    if (!isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const postCollection = db.collection("posts");
    const userCollection = db.collection("users");

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.sold) {
      return res.status(400).json({ message: "Post is already sold" });
    }

    const buyerId = post.buyerId;

    console.log("Post found:", post);
    console.log("Seller ID:", sellerId);
    console.log("Buyer ID:", buyerId);

    // Mark the post as sold and pending as false
    const postUpdateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { sold: true, pending: false } }
    );

    if (postUpdateResult.matchedCount === 0) {
      console.error("Failed to update the post");
      return res.status(500).json({ message: "Failed to update the post" });
    }

    console.log("Post update result:", postUpdateResult);

    // Remove from buyer's pendingPosts
    const buyerPendingUpdateResult = await userCollection.updateOne(
      { _id: new ObjectId(buyerId) },
      { $pull: { pendingPosts: new ObjectId(postId) } }
    );

    console.log("Buyer pendingPosts update result:", buyerPendingUpdateResult);

    if (buyerPendingUpdateResult.matchedCount === 0) {
      console.error("Failed to update the buyer's pendingPosts");
      return res.status(500).json({ message: "Failed to update the buyer's pendingPosts" });
    }

    // Add to buyer's purchasedPosts
    const buyerPurchasedUpdateResult = await userCollection.updateOne(
      { _id: new ObjectId(buyerId) },
      { $push: { purchasedPosts: new ObjectId(postId) } }
    );

    console.log("Buyer purchasedPosts update result:", buyerPurchasedUpdateResult);

    if (buyerPurchasedUpdateResult.matchedCount === 0) {
      console.error("Failed to update the buyer's purchasedPosts");
      return res.status(500).json({ message: "Failed to update the buyer's purchasedPosts" });
    }

    // Add notification to the buyer
    const buyerNotificationUpdateResult = await userCollection.updateOne(
      { _id: new ObjectId(buyerId) },
      { $push: {
          notifications: {
            type: "acceptance",
            message: `${req.user.username} accepted your request for ${post.name}`,
            postId: postId,
            sellerUsername: req.user.username,
          }
        }
      }
    );

    console.log("Buyer notification update result:", buyerNotificationUpdateResult);

    if (buyerNotificationUpdateResult.matchedCount === 0) {
      console.error("Failed to update the buyer's notifications");
      return res.status(500).json({ message: "Failed to update the buyer's notifications" });
    }

    // Remove from seller's pendingRequests
    const sellerUpdateResult = await userCollection.updateOne(
      { _id: new ObjectId(sellerId) },
      { $pull: { pendingRequests: new ObjectId(postId) } }
    );

    console.log("Seller update result:", sellerUpdateResult);

    if (sellerUpdateResult.matchedCount === 0) {
      console.error("Failed to update the seller");
      return res.status(500).json({ message: "Failed to update the seller" });
    }

    res.status(200).json({ message: "Request accepted and buyer notified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting request" });
  }
});

export default router;
