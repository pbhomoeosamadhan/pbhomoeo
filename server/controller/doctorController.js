const Doctor = require("../model/doctorModel");
const bcrypt = require("bcrypt");

const createDoctor = async (req, res) => {
  try {
    const { medicalName, doctorName, password, email, phone, address } =
      req.body;

    if (
      !medicalName ||
      !doctorName ||
      !password ||
      !email ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createNewDoctor = new Doctor({
      medicalName,
      doctorName,
      password: hashedPassword,
      email,
      phone,
      address,
    });
    console.log(createDoctor);
    await createNewDoctor.save();

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: createNewDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDoctor = async (req, res) => {
  try {
    const getAllDoctor = await Doctor.find();
    res.status(200).json(getAllDoctor);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getDoctor, createDoctor };
