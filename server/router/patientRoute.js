const express = require("express");
const {
  getAllPatient,
  createNewPatient,
  getNextId,
  updatePatient,
  addVisit,
  deleteVisit,
  getAllPatientByChamId,
} = require("../controller/patientController");

const router = express.Router();

router.get("/", getAllPatient);
router.get("/:chamId", getAllPatientByChamId);
router.get("/next/:chamId", getNextId);
router.post("/", createNewPatient);
router.put("/:id", updatePatient);
router.post("/:id/visits", addVisit);
router.delete("/:id/visits/:visitId", deleteVisit);

module.exports = router;
