const serialModel = require("../model/serialModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const path = require("path");

const createSerial = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        status: "fail",
        message: "No image uploaded",
      });
    }

    const { pId } = req.body;
    const file = req.files.photo;

    // 🔥 Convert buffer to base64
    const base64Image = `data:${file.mimetype};base64,${file.data.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "serials",
    });

    const serial = await serialModel.create({
      pId,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      status: "success",
      data: serial,
    });
  } catch (error) {
    console.error("Serial Upload Error:", error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getSerials = async (req, res) => {
  try {
    const serials = await serialModel.find();
    res.status(200).json({
      status: "success",
      data: serials,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = { createSerial, getSerials };
