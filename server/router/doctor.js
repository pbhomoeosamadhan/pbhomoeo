const express = require("express");
const { getDoctor, createDoctor } = require("../controller/doctorController");
const router = express.Router();

router.get("/", getDoctor);
router.post("/", createDoctor);

module.exports = router;
