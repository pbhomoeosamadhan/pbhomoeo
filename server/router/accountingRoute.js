const express = require("express");
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controller/accountingController");

const router = express.Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
