const mongoose = require("mongoose");
const catagorySchema = require("../schema/catagorySchema");

const catagoryModel = mongoose.model("catagory", catagorySchema);
module.exports = catagoryModel;
