import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';


const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });



// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, 
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));


// Health check route
app.get("/", (req, res) => {
  res.send("Hello from the backend 👋");
});

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file64 = req.file.buffer.toString("base64");
    
    const dataURI = `data:${req.file.mimetype};base64,${file64}`;

    const result = await cloudinary.uploader.upload(dataURI);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
