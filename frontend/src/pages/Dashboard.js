import React, { useEffect, useState } from "react";
import API from "../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Pill, Clock, Calendar } from "lucide-react";

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/medicines");
        setMedicines(res.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    };
    fetchData();
  }, []);

  const chartData = medicines.map((m) => ({
    name: m.name,
    Taken: m.takenCount || 0,
    Missed: m.missedCount || 0,
  }));

  return (
    <div className="dashboard-container">
      <h1>📊 Dashboard</h1>

      <div className="dashboard-summary">
        <div className="card"><Pill /><h3>Total Medicines</h3><p>{medicines.length}</p></div>
        <div className="card"><Clock /><h3>Active Reminders</h3><p>{medicines.filter(m => m.reminderTime).length}</p></div>
        <div className="card"><Calendar /><h3>Ongoing Courses</h3><p>{medicines.filter(m => m.endDate).length}</p></div>
      </div>

      <h2>🕒 Medicine Schedule</h2>
      {medicines.map((m) => (
        <div key={m._id} className="reminder-card">
          <strong>{m.name}</strong> — Reminder at {m.reminderTime || "Not Set"} — Status: {m.lastStatus}
        </div>
      ))}

      <h2>📈 Medicine Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Taken" fill="#48bb78" />
          <Bar dataKey="Missed" fill="#e53e3e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
