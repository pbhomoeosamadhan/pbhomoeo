const express = require("express");
const { createSerial, getSerials } = require("../controller/serialController");
const router = express.Router();

router.post("/", createSerial);
router.get("/", getSerials);

module.exports = router;
