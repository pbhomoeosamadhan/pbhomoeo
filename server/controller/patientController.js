const Patient = require("../model/patientModel");

const createNewPatient = async (req, res) => {
  try {
    const {
      patientSerial,
      patientName,
      patientAge,
      patientDate,
      history,
      visits,
      patientMobile,
    } = req.body;

    if (!patientName || !patientAge || !patientMobile) {
      return res.status(400).json({ message: "Mandatory fields are required" });
    }

    const patient = new Patient({
      patientSerial,
      patientName,
      patientMobile,
      patientAge,
      patientDate,
      history: history || {},
      visits: visits || [],
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const getAllPatient = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ patientSerial: -1 }); // latest first

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};
const getNextId = async (req, res) => {
  try {
    const lastPatient = await Patient.findOne().sort({ patientSerial: -1 });

    const nextId = lastPatient ? lastPatient.patientSerial + 1 : 20260001;

    res.status(200).json({ nextId });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch next patient ID",
      error: error.message,
    });
  }
};

// Update patient by ID
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update patient",
      error: error.message,
    });
  }
};

const addVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visitData = req.body; // {date, problem, symtoms, prescriptions, condition, duration}

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.visits.push(visitData);
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to add visit", error: error.message });
  }
};

const deleteVisit = async (req, res) => {
  try {
    const { id, visitId } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const visitIndex = patient.visits.findIndex(
      (v) => v._id.toString() === visitId
    );

    if (visitIndex === -1) {
      return res.status(404).json({ message: "Visit not found" });
    }

    patient.visits.splice(visitIndex, 1);
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllPatient,
  createNewPatient,
  getNextId,
  updatePatient,
  addVisit,
  deleteVisit,
};
