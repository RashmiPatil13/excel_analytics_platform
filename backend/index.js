const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.use("/api", uploadRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(5000, () => console.log("Server running...")))
  .catch((err) => console.log(err));
