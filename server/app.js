// require("dotenv").config();
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

// const doctorRoute = require("./router/doctor");
// const patientRoute = require("./router/patientRoute");
// const catagoryRoute = require("./router/catagoryRoute");
// const accountingRoute = require("./router/accountingRoute");
// const historyRoute = require("./router/historyRoute");
// const serialRoute = require("./router/serialRoute");

// app.use(cors("*"));
// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true }));
// mongoose
//   .connect(MONGODB_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection failed:", error.message);
//   });

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.use("/doctors", doctorRoute);
// app.use("/patients", patientRoute);
// app.use("/catagory", catagoryRoute);
// app.use("/accounting", accountingRoute);
// app.use("/history", historyRoute);
// app.use("/serial", serialRoute);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db"); // ১ নম্বর ধাপে তৈরি করা ফাইলটি রিকোয়ার করুন
const PORT = process.env.PORT || 5000;

const doctorRoute = require("./router/doctor");
const patientRoute = require("./router/patientRoute");
const catagoryRoute = require("./router/catagoryRoute");
const accountingRoute = require("./router/accountingRoute");
const historyRoute = require("./router/historyRoute");
const serialRoute = require("./router/serialRoute");

app.use(cors("*"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serverless Middleware: প্রতি রিকোয়েস্টে ডেটাবেজ কানেকশন চেক করবে
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/doctors", doctorRoute);
app.use("/patients", patientRoute);
app.use("/catagory", catagoryRoute);
app.use("/accounting", accountingRoute);
app.use("/history", historyRoute);
app.use("/serial", serialRoute);

// Vercel-এর জন্য module.exports এক্সপোর্ট করা নিরাপদ
module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}