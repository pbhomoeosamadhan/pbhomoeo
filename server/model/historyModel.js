const mongoose = require("mongoose");
const historySchema = require("../schema/historySchema");

const History = mongoose.model("History", historySchema);

module.exports = History;