const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const fileRoutes = require("./routes/fileRoutes");
const insights = require("./routes/insights");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api", fileRoutes);
app.use("/api", uploadRoutes);
app.use("/api/insights", require("./routes/insights"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(5000, () => console.log("Server running...")))
  .catch((err) => console.log(err));
