const { model } = require("mongoose");
const serialSchema = require("../schema/serialSchema");

const serialModel = model("serial", serialSchema);

module.exports = serialModel;
