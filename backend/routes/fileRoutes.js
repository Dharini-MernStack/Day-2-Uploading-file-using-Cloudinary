const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const Upload = require("../models/Upload");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// File Upload API
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        // Save to MongoDB
        const upload = new Upload({
          url: result.secure_url,
          publicId: result.public_id,
        });
        await upload.save();

        res.json({
          url: result.secure_url,
          publicId: result.public_id,
        });
      })
      .end(req.file.buffer);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Get all uploads
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

module.exports = router;
