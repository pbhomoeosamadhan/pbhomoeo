const Catagory = require("../model/catagoryModel");

// CREATE CATEGORY
const createCatagory = async (req, res) => {
  try {
    const newCatagory = await Catagory.create(req.body);

    res.status(201).json(newCatagory); // ✅ IMPORTANT
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// GET ALL
const getAllCatagory = async (req, res) => {
  try {
    const catagory = await Catagory.find();
    res.status(200).json(catagory);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// UPDATE SUB CATEGORY
const updateCatagory = async (req, res) => {
  try {
    const updated = await Catagory.findByIdAndUpdate(
      req.params.id,
      { subCatagory: req.body.subCatagory },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

module.exports = {
  createCatagory,
  getAllCatagory,
  updateCatagory,
};
