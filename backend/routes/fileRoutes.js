// backend/routes/fileRoutes.js

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer config
const storage = multer.memoryStorage(); // temporarily holds image in memory
const upload = multer({ storage });

// Upload Endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;

    // Convert to base64
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "uploads", // optional folder name on Cloudinary
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

module.exports = router;