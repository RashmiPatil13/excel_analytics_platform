const xlsx = require("xlsx");
const fs = require("fs");
const File = require("../models/File");
// const auth = require("./middleware/auth");
const path = require("path");

exports.uploadAndParseExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);
    const workbook = xlsx.readFile(filePath); // 💥 this line
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const newFile = new File({
      // filename: req.file.originalname,
      originalname: req.file.originalname, // ✅ important
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      data,
      uploadedBy: req.user.id,
    });

    await newFile.save();
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Excel parsing error:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });

    console.log("Received file:", req.file);
    if (data) {
      console.log("Parsed data:", data.slice(0, 5));
    }
  }
};

// exports.uploadAndParseExcel = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const filePath = req.file.path;
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     const saved = await File.create({ filename: req.file.originalname, data });
//     fs.unlinkSync(filePath);

//     res.status(200).json({ message: "Uploaded", file: saved });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAllData = async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     if (!file) return res.status(404).json({ message: "Not found" });
//     res.status(200).json(file.data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getAllData = async (req, res) => {
  try {
    console.log("Requested file ID:", req.params.id); // 🔍 add this

    const file = await File.findById(req.params.id);
    if (!file) {
      console.log("Fetching data for ID:", req.params.id);
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json(file.data);
  } catch (err) {
    console.error("Error fetching file:", err.stack); // 🔍 log full stack trace
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
