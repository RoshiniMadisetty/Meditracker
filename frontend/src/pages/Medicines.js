import React, { useEffect, useState } from "react";
import API from "../api";

export default function Medicines() {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: 1,
    reminderTime: "",
    startDate: "",
    endDate: "",
  });

  const load = async () => {
    const res = await API.get("/medicines");
    setMeds(res.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/medicines", form);
    setForm({ name: "", dosage: "", frequency: 1, reminderTime: "", startDate: "", endDate: "" });
    load();
    alert("✅ Medicine added successfully!");
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <form onSubmit={submit} style={{ flex: 1 }}>
        <h2>Add New Medicine</h2>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            required
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            type={
              key.includes("Date")
                ? "date"
                : key === "frequency"
                ? "number"
                : key === "reminderTime"
                ? "time"
                : "text"
            }
            style={{ display: "block", margin: "5px 0", padding: "8px", width: "100%" }}
          />
        ))}
        <button style={{ padding: "8px 16px" }}>Add Medicine</button>
      </form>

      <div style={{ flex: 1 }}>
        <h2>Your Medicines</h2>
        {meds.map((m) => (
          <div key={m._id} style={{ background: "#eef", margin: "8px 0", padding: "10px" }}>
            <b>{m.name}</b> — {m.reminderTime}
          </div>
        ))}
      </div>
    </div>
  );
}
