const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { createSerial, getSerials } = require("../controller/serialController");
const router = express.Router();

router.post("/", upload.single("photo"), createSerial);
router.get("/", getSerials);

module.exports = router;
