const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  medicalName: { type: String },
  doctorName: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  password: { type: String },
});

module.exports = doctorSchema;
