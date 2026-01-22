const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Medicine = require("../models/Medicine");

// Add new medicine
router.post("/", auth, async (req, res) => {
  try {
    const med = new Medicine({ ...req.body, user: req.user.id });
    await med.save();
    res.json(med);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error adding medicine" });
  }
});

// Get all medicines
router.get("/", auth, async (req, res) => {
  try {
    const meds = await Medicine.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching medicines" });
  }
});

// Delete medicine
router.delete("/:id", auth, async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ msg: "Medicine deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting medicine" });
  }
});

// Mark as taken
router.post("/:id/taken", auth, async (req, res) => {
  try {
    const med = await Medicine.findOne({ _id: req.params.id, user: req.user.id });
    if (!med) return res.status(404).json({ msg: "Medicine not found" });
    med.takenCount += 1;
    med.lastStatus = "Taken";
    await med.save();
    res.json({ msg: "Medicine marked as taken", med });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating medicine" });
  }
});

// Mark as missed
router.post("/:id/missed", auth, async (req, res) => {
  try {
    const med = await Medicine.findOne({ _id: req.params.id, user: req.user.id });
    if (!med) return res.status(404).json({ msg: "Medicine not found" });
    med.missedCount += 1;
    med.lastStatus = "Missed";
    await med.save();
    res.json({ msg: "Medicine marked as missed", med });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating medicine" });
  }
});

module.exports = router;
