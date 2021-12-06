const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema({
  shortURL: { type: Number, default: 1 },
  originalURL: { type: String, required: true },
});

exports.URL = mongoose.model("URL", urlSchema, "URL");
