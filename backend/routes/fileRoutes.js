const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Upload = require('../models/Upload');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// File Upload API
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log('Upload request received:', {
    file: req.file ? {
      name: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    } : 'No file',
    body: req.body
  });

  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ 
      success: false,
      error: "No file uploaded",
      message: "Please select a file to upload"
    });
  }

  try {
    console.log('Starting Cloudinary upload...');
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }
      ]
    });

    console.log('Cloudinary upload successful:', {
      url: result.secure_url,
      public_id: result.public_id
    });

    // Save to MongoDB
    const uploadDoc = new Upload({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height
    });

    await uploadDoc.save();
    console.log('MongoDB save successful');

    // Clean up: delete the temporary file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Temporary file cleaned up');
    }

    res.json({ 
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    // Clean up: delete the temporary file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up temporary file after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({ 
      success: false,
      error: "Upload failed",
      message: error.message || "An error occurred while uploading the file"
    });
  }
});

// Get all uploads
router.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: uploads
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch uploads",
      message: error.message
    });
  }
});

module.exports = router;
