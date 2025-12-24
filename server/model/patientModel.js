const mongoose = require("mongoose");
const patientSchema = require("../schema/patientSchema");

const patientModel = mongoose.model("Patient", patientSchema);
module.exports = patientModel;
