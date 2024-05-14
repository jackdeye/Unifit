import express from "express";
import records from "./routes/record.js";
import cors from 'cors';
import db from "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use("/record", records);
// app.use(cors());

// Allow requests from specific origins
// app.use(cors({ origin: 'http://localhost:3000' }));

// Allow all origins and set other CORS headers
//methods: 'OPTIONS, GET, POST, PUT, DELETE'
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));

app.post("/upload", async (req, res) => {
  // Your logic for handling the POST request goes here
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };

    let collection = db.collection("records");
    let result = await collection.insertOne(newDocument);
    
    // Send a success response
    res.sendStatus(204); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// app.get("/update", (req, res) => {
//   res.json({ message: "Hellooo from server!" });
// });
// const corsOptions = {
//   origin: 'http://localhost:5174',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Add allowed headers
// };

// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
