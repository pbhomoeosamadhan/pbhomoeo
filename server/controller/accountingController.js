const Accounting = require("../model/accountingModel");

const getTransactions = async (req, res) => {
  try {
    const transactions = await Accounting.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { date, description, type, amount } = req.body;

    if (!date || !description || !type || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = new Accounting({
      date,
      description,
      type,
      amount,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Accounting.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
