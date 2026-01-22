const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["taken", "missed"], required: true },
});

module.exports = mongoose.model("Log", LogSchema);
