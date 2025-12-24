const History = require("../model/historyModel");

// GET ALL HISTORY
const getAllHistory = async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// CREATE NEW HISTORY
const createHistory = async (req, res) => {
  try {
    const newHistory = await History.create(req.body);
    res.status(201).json(newHistory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// UPDATE SUB HISTORY
const updateHistory = async (req, res) => {
  try {
    const updated = await History.findByIdAndUpdate(
      req.params.id,
      { subHistory: req.body.subHistory },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

module.exports = { getAllHistory, createHistory, updateHistory };
