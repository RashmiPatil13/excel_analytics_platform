const xlsx = require("xlsx");
const fs = require("fs");
const File = require("../models/File");

exports.uploadAndParseExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath); // 💥 this line
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const newFile = new FileModel({
      filename: req.file.originalname,
      data,
    });

    await newFile.save();
    fs.unlinkSync(filePath); // optional

    res.status(200).json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Excel parsing error:", err);
    res.status(500).json({ message: "Server error", error: err.message });

    console.log("Received file:", req.file);
    console.log("Parsed data:", data.slice(0, 5)); // show only first few rows
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

exports.getAllData = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "Not found" });
    res.status(200).json(file.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
