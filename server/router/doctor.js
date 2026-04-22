const express = require("express");
const {
  getDoctor,
  createDoctor,
  getDoctorById,
} = require("../controller/doctorController");
const router = express.Router();

router.get("/", getDoctor);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);

module.exports = router;
