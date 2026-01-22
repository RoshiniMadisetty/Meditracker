const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  dosage: String,
  frequency: Number,
  reminderTime: String,
  startDate: Date,
  endDate: Date,
  takenCount: { type: Number, default: 0 },
  missedCount: { type: Number, default: 0 },
  lastStatus: { type: String, enum: ["Taken", "Missed", "Pending"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Medicine", MedicineSchema);
