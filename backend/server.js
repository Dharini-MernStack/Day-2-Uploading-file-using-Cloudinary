const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");


const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));




app.use("/api/files", fileRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));