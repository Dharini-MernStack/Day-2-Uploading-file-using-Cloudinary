require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Only use JSON body parser AFTER file routes (Multer needs raw stream for file uploads)
app.use("/api/files", fileRoutes); // 👈 File upload routes FIRST

app.use(express.json()); // 👈 Use JSON parsing after file upload middleware

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
