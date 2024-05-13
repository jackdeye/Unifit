import express from "express";
import records from "./routes/record.js";
import cors from 'cors';


const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use("/record", records);
//app.use(cors());

// Allow requests from specific origins
//app.use(cors({ origin: 'http://localhost:3000' }));

// Allow all origins and set other CORS headers
app.use(cors({ origin: 'http://localhost:5050/upload', credentials: true, methods: 'OPTIONS, GET, POST, PUT, DELETE' }));

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
