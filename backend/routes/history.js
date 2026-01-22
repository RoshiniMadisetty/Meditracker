const express = require("express");
const router = express.Router();
const History = require("../models/History");
const auth = require("../middleware/auth");

// ✅ Get all history for a user
router.get("/", auth, async (req, res) => {
  try {
    const records = await History.find({ user: req.user._id }).populate("medicine");
    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Mark medicine as taken or missed
router.post("/mark", auth, async (req, res) => {
  try {
    const { medicineId, status } = req.body;
    if (!medicineId || !status)
      return res.status(400).json({ msg: "Missing required fields" });

    const record = await History.create({
      user: req.user._id,
      medicine: medicineId,
      medicineName: status === "taken" ? "✅ Taken" : "❌ Missed",
      status,
    });

    res.json(record);
  } catch (err) {
    console.error("❌ Error updating history:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
