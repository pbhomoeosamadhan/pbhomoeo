const { Schema, model } = require("mongoose");

const serialSchema = new Schema({
  pId: {
    type: Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

module.exports = serialSchema;
