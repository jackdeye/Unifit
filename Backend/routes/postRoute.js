import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/upload", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("posts");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

// router.post('/upload', async (req, res) => {
//   try {
//     const { name, desc } = req.body;  // 'name' and 'desc' data fields
//     console.log(`Received name: ${name}, desc: ${desc}`);
    
//     // Make a POST request to the specified URL
//     const response = await fetch('http://localhost:5050/upload', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ name, desc }) // Send 'name' and 'desc' as JSON in the request body
//     });

//     // Check if the request was successful
//     if (response.ok) {
//       // Retrieve the response data
//       const responseData = await response.text();
//       console.log('Server response:', responseData);
//       res.status(201).send('Post saved successfully');
//     } else {
//       // Handle errors if the request was not successful
//       throw new Error('Failed to save post.');
//     }
//   } catch (error) {
//     // Handle any errors that occur during the request
//     console.error('Error submitting post:', error);
//     res.status(500).send('Error saving post.');
//   }
// });

export default router;
