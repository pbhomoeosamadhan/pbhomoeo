const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientSerial: { type: Number, required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientMobile: { type: String, required: true },
    patientDate: Date,

    history: {
      presentHistory: [{ type: String }],
      pastHistory: [{ type: String }],
      familyHistory: [{ type: String }],
    },

    medicalHistory: [
      {
        type: String,
      },
    ],

    visits: [
      {
        date: Date,
        problem: String,
        condition: String,
        duration: String,
        symtoms: {
          symtomsName: String,
          subSymtoms: [{ subSymtomsName: String }],
        },
        prescriptions: [{ name: String, dose: String }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = patientSchema;
