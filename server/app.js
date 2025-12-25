require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(cors("*"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "tmp/",
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const doctorRoute = require("./router/doctor");
const patientRoute = require("./router/patientRoute");
const catagoryRoute = require("./router/catagoryRoute");
const accountingRoute = require("./router/accountingRoute");
const historyRoute = require("./router/historyRoute");
const serialRoute = require("./router/serialRoute");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(
  fileUpload({
    useTempFiles: false, // 🔥 IMPORTANT
    limits: { fileSize: 5 * 1024 * 1024 }, // optional
  })
);
app.use("/doctors", doctorRoute);
app.use("/patients", patientRoute);
app.use("/catagory", catagoryRoute);
app.use("/accounting", accountingRoute);
app.use("/history", historyRoute);
app.use("/serial", serialRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
