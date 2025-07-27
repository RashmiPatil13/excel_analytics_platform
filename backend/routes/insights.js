// const express = require("express");
// const { spawn } = require("child_process");
// const path = require("path");
// const File = require("../models/File");
// const auth = require("../middleware/auth");

// const router = express.Router();

// router.get("/:id", async (req, res) => {
//   const fileId = req.params.id;
//   console.log("Getting insights for fileId:", fileId);

//   try {
//     const file = await File.findById(fileId); // ✅ Also fix FileModel → File
//     if (!file) {
//       console.log("File not found");
//       return res.status(404).json({ error: "File not found" });
//     }

//     // Temporary: just return the file metadata to confirm it's working
//     res.json({ message: "File found", name: file.originalname });

//     const py = spawn("python", ["./python/insights.py", file.path]);

//     let out = "";
//     py.stdout.on("data", (d) => (out += d));
//     py.on("close", () => {
//       try {
//         res.json(JSON.parse(out));
//       } catch {
//         res.status(500).json({ message: "Python output error" });
//       }
//     });
//   } catch (err) {
//     console.error("Error in /insights/:id →", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { spawn } = require("child_process");
// const File = require("../models/File");
// const router = express.Router();

// // GET /api/insights/:id   (router mounted at /api/insights)
// router.get("/:id", async (req, res) => {
//   const fileId = req.params.id;
//   console.log("Getting insights for fileId:", fileId);

//   try {
//     const file = await File.findById(fileId); // <-- File (not FileModel)
//     if (!file) {
//       return res.status(404).json({ error: "File not found" });
//     }

//     /* ---- run Python and wait for it to finish ---- */
//     const py = spawn("python", ["./python/insights.py", file.path]);

//     let stdout = "";
//     let stderr = "";

//     py.stdout.on("data", (d) => (stdout += d));
//     py.stderr.on("data", (e) => (stderr += e));

//     py.on("close", (code) => {
//       if (stderr) console.error("Python stderr:", stderr);
//       if (code !== 0) {
//         return res
//           .status(500)
//           .json({ error: `Python exited with code ${code}` });
//       }

//       try {
//         res.json(JSON.parse(stdout)); // ✅ single, final response
//       } catch (err) {
//         console.error("JSON parse error:", err, "\nRaw output:", stdout);
//         res.status(500).json({ error: "Python output error" });
//       }
//     });
//   } catch (err) {
//     console.error("Internal route error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;
const express = require("express");
const fs = require("fs");
const xlsx = require("xlsx");
const File = require("../models/File");
const generateInsights = require("../utils/generateInsights");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    if (!fs.existsSync(file.path))
      return res.status(410).json({ error: "File missing on disk" });

    const wb = xlsx.readFile(file.path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: false });

    const insights = generateInsights(rows);
    return res.json({ insights });
  } catch (err) {
    console.error("Insight route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
