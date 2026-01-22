const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  medicineName: String,
  status: { type: String, enum: ["taken", "missed"], default: "missed" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
