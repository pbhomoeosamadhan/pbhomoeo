const express = require("express");
const {
  getAllCatagory,
  createCatagory,
  updateCatagory,
} = require("../controller/catagoryController");
const router = express.Router();

router.get("/", getAllCatagory);
router.post("/", createCatagory);
router.put("/:id", updateCatagory);

module.exports = router;
