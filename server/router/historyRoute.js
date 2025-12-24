const express = require("express");
const {
  getAllHistory,
  createHistory,
  updateHistory,
} = require("../controller/historyController");

const router = express.Router();

router.get("/", getAllHistory);
router.post("/", createHistory);
router.put("/:id", updateHistory);

module.exports = router;
