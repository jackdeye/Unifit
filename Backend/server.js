import express from "express";
import cors from 'cors';

// Import routes
import postRoutes from "./routes/postRoute.js";
// import userRoutes from "./routes/userRoute.js";

// Start the Node Express server
const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// API Routes
app.use("/post", postRoutes);
// app.use("/user", userRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
