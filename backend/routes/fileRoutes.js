const express = require("express");
const router = express.Router();
const File = require("../models/File");
const auth = require("../middleware/auth");

// GET all uploaded files
router.get("/all-files", async (req, res) => {
  try {
    const files = await File.find().select("_id filename uploadedAt");
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// GET /api/files

router.get("/files", auth, async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(401).json({ message: "No user in request" });

  try {
    const files = await File.find({ uploadedBy: userId }).select(
      "_id originalname filename createdAt"
    );
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

router.get("/files", async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id }).select(
      "_id originalname filename createdAt"
    );

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching files" });
  }
});

// ✅ DELETE /api/files/:id - Delete file by ID (user only deletes their own files)
router.delete("/files/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const file = await File.findOneAndDelete({
    _id: req.params.id,
    uploadedBy: userId,
  });
  if (!file) return res.status(404).json({ message: "File not found" });
  res.json({ message: "File deleted" });
});
//download
router.get("/download/:filename", auth, async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.download(filePath);
});

module.exports = router;
