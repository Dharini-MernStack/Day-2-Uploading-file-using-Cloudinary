const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ File Upload Endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("📁 File received:", filePath);

    // Upload to Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);

    // Delete temp file
    fs.unlinkSync(filePath);
    console.log("🧹 Temp file deleted");

    res.json({ url: result.secure_url });

  } catch (error) {
    console.error("🔥 Upload failed:", error.message);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});


module.exports = router;
