// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const fileUpload = require("express-fileupload");
// const cloudinary = require("cloudinary").v2;

// const app = express();

// app.use(cors("*"));
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: '/tmp/'
// }));

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

// const doctorRoute = require("./router/doctor");
// const patientRoute = require("./router/patientRoute");
// const catagoryRoute = require("./router/catagoryRoute");
// const accountingRoute = require("./router/accountingRoute");
// const historyRoute = require("./router/historyRoute");
// const serialRoute = require("./router/serialRoute");

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
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

// Route imports
const doctorRoute = require("./router/doctor");
const patientRoute = require("./router/patientRoute");
const catagoryRoute = require("./router/catagoryRoute");
const accountingRoute = require("./router/accountingRoute");
const historyRoute = require("./router/historyRoute");
const serialRoute = require("./router/serialRoute");

const app = express();

// Configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Middleware Setup
app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB লিমিট যোগ করুন
    abortOnLimit: true,
  })
);

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // MongoDB connection event listeners
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // প্রোডাকশনে সংযোগ ব্যর্থ হলে প্রসেস বন্ধ করুন
  });

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running...",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/doctors", doctorRoute); // /api prefix যোগ করার পরামর্শ
app.use("/api/patients", patientRoute);
app.use("/api/categories", catagoryRoute); // "catagory" → "categories" স্পেলিং চেক করুন
app.use("/api/accounting", accountingRoute);
app.use("/api/history", historyRoute);
app.use("/api/serial", serialRoute);

// 404 Error Handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Server Startup
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server gracefully...");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = app; // Testing-এর জন্য এক্সপোর্ট
