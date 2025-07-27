// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const {
  uploadAndParseExcel,
  getAllData,
} = require("../controllers/uploadController");

const router = express.Router();

/* ---------- Multer setup ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ---------- POST /upload-excel ---------- */
router.post(
  "/upload-excel",
  auth, // ①  adds req.user
  upload.single("excelFile"), // ②  parses multipart form
  uploadAndParseExcel // ③  saves File with uploadedBy
);

/* ---------- GET /data/:id ---------- */
router.get("/data/:id", auth, getAllData);

module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const auth = require("../middleware/auth");
// const File = require("../models/File");
// const {
//   uploadAndParseExcel,
//   getAllData,
// } = require("../controllers/uploadController");

// const router = express.Router();
// /* ---------- Multer setup ---------- */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// // router.post("/upload-excel", upload.single("excelFile"), uploadAndParseExcel);
// /* ---------- POST /upload-excel ---------- */
// router.post(
//   "/upload-excel",
//   auth,
//   upload.single("excelFile", uploadAndParseExcel),

//   async (req, res) => {
//     try {
//       // req.file is filled in by multer
//       const newFile = await File.create({
//         originalname: req.file.originalname,
//         filename: req.file.filename,
//         mimetype: req.file.mimetype,
//         size: req.file.size,
//         path: req.file.path,
//       });

//       res.json({ file: newFile });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Upload failed" });
//     }
//   }
// );

// /* ---------- GET /data/:id ---------- */
// router.get("/data/:id", auth, getAllData);

// module.exports = router;
