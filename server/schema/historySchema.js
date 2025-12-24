const mongoose = require("mongoose");
const { Schema } = mongoose;

const historySchema = new Schema(
  {
    historyName: {
      type: String,
      unique: true,
      trim: true,
    },
    subHistory: [
      {
        subHistoryName: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = historySchema;
