require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["*", "https://pbhms.vercel.app/*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const doctorRoute = require("./router/doctor");
const patientRoute = require("./router/patientRoute");
const catagoryRoute = require("./router/catagoryRoute");
const accountingRoute = require("./router/accountingRoute");
const historyRoute = require("./router/historyRoute");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/doctors", doctorRoute);
app.use("/patients", patientRoute);
app.use("/catagory", catagoryRoute);
app.use("/accounting", accountingRoute);
app.use("/history", historyRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
