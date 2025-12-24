const mongoose = require("mongoose");

const accountingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Accounting = mongoose.model("Accounting", accountingSchema);

module.exports = Accounting;
