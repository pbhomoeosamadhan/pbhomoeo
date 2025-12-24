const mongoose = require("mongoose");

const catagorySchema = mongoose.Schema({
  catagoryName: String,
  subCatagory: [
    {
      subCatagoryName: String,
    },
  ],
});

module.exports = catagorySchema;
