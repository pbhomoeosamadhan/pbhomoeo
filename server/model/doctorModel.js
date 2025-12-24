const mongoose = require("mongoose");
const doctorSchema = require("../schema/doctorSchema");

const doctorModel = mongoose.model("doctor", doctorSchema);
module.exports = doctorModel;
