const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadAndParseExcel,
  getAllData,
} = require("../controllers/uploadController");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/upload-excel", upload.single("excelFile"), uploadAndParseExcel);
router.get("/data/:id", getAllData);

module.exports = router;
