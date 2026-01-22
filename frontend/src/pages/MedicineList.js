// frontend/src/pages/MedicineList.js
import React, { useEffect, useState } from "react";
import API from "../api";

export default function MedicineList() {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    reminderTime: "", // will be "HH:MM"
    startDate: "",
    endDate: "",
  });
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMeds = async () => {
    try {
      const res = await API.get("/medicines");
      setMeds(res.data);
    } catch (err) {
      console.error("Failed to load meds:", err);
      alert("Error loading medicines");
    }
  };

  useEffect(() => {
    loadMeds();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // normalize reminderTime: input type="time" will produce "HH:MM"
      const payload = {
        ...form,
        reminderTime: form.reminderTime,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      await API.post("/medicines", payload);

      setForm({
        name: "",
        dosage: "",
        frequency: "",
        reminderTime: "",
        startDate: "",
        endDate: "",
      });

      await loadMeds();
      alert("Medicine added");
    } catch (err) {
      console.error("Error adding medicine:", err);
      const msg = err?.response?.data?.msg || "Error adding medicine";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await API.delete(`/medicines/${id}`);
      await loadMeds();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting medicine");
    }
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <form onSubmit={submit} style={{ width: "45%", background: "#eee", padding: 20, borderRadius: 8 }}>
        <h2>Add New Medicine</h2>

        <label>Medicine Name</label>
        <input name="name" value={form.name} onChange={onChange} required style={{ width: "100%", padding: 8 }} />

        <label>Dosage</label>
        <input name="dosage" value={form.dosage} onChange={onChange} style={{ width: "100%", padding: 8 }} />

        <label>Frequency</label>
        <input name="frequency" value={form.frequency} onChange={onChange} style={{ width: "100%", padding: 8 }} />

        <label>Reminder Time</label>
        <input type="time" name="reminderTime" value={form.reminderTime} onChange={onChange} style={{ width: "100%", padding: 8 }} required />

        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={onChange} style={{ width: "100%", padding: 8 }} required />

        <label>End Date</label>
        <input type="date" name="endDate" value={form.endDate} onChange={onChange} style={{ width: "100%", padding: 8 }} required />

        <button type="submit" disabled={loading} style={{ marginTop: 12, padding: "10px 16px" }}>
          {loading ? "Saving..." : "Save Medicine"}
        </button>
      </form>

      <div style={{ width: "55%", background: "#eaf6ff", padding: 20, borderRadius: 8 }}>
        <h2>Your Medicines</h2>
        {meds.length === 0 && <p>No medicines added yet</p>}
        {meds.map((m) => (
          <div key={m._id} style={{ background: "#f7ffd9", padding: 12, borderRadius: 8, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold" }}>💊 {m.name} — {m.reminderTime}</div>
              <div style={{ fontSize: 12 }}>{m.startDate && new Date(m.startDate).toLocaleDateString()} → {m.endDate && new Date(m.endDate).toLocaleDateString()}</div>
            </div>
            <div>
              <button onClick={() => handleDelete(m._id)} style={{ background: "#ff6b6b", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 8 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
