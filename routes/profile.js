const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const multer = require("multer");
const path = require("path");

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ROUTES
router.get("/", profileController.getProfile);
router.post("/update", upload.single("profileImage"), profileController.updateProfile);

module.exports = router;