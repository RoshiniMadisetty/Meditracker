// backend/routes/logs.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const auth = require("../middleware/auth");

// ✅ Get all logs for user (with medicine info)
router.get("/", auth, async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id })
      .populate("medicine")
      .sort({ scheduledAt: 1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Mark a log as Taken / Missed (only once)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["taken", "missed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const log = await Log.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ msg: "Log not found" });

    if (log.status === "taken" || log.status === "missed") {
      return res.status(400).json({ msg: "Already marked once" });
    }

    log.status = status;
    await log.save();
    res.json({ msg: `Marked as ${status}`, log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
