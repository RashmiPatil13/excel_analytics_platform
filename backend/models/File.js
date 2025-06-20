const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: String,
    data: [{}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
