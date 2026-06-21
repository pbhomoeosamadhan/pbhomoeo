const express = require("express");
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getChambTransactions,
} = require("../controller/accountingController");

const router = express.Router();

router.get("/", getTransactions);
router.get("/:chamId", getChambTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
