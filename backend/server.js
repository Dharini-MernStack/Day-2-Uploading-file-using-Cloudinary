require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const cloudinary = require("cloudinary").v2;
const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

app.use("/api/files", fileRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
