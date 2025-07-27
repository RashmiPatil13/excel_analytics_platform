// const mongoose = require("mongoose");

// const FileSchema = new mongoose.Schema(
//   {
//     filename: String,
//     data: Array,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("File", FileSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fileSchema = new mongoose.Schema(
  {
    originalname: { type: String, required: true },
    filename: String,
    mimetype: String,
    size: Number,
    path: String,
    data: Array,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
