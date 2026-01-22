import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ClipboardList } from "lucide-react";

export default function History() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/medicines");
        setMedicines(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const chartData = medicines.map((m) => ({
    name: m.name,
    Taken: m.takenCount || 0,
    Missed: m.missedCount || 0,
  }));

  const totalTaken = chartData.reduce((acc, m) => acc + m.Taken, 0);
  const totalMissed = chartData.reduce((acc, m) => acc + m.Missed, 0);

  return (
    <div className="history-container">
      <h1>
        <ClipboardList /> History
      </h1>

      <div className="summary">
        <div className="card">
          <h3>Taken Doses</h3>
          <p>{totalTaken}</p>
        </div>
        <div className="card">
          <h3>Missed Doses</h3>
          <p>{totalMissed}</p>
        </div>
      </div>

      <h2>Medicine History</h2>
      {medicines.length === 0 ? (
        <p>No history available yet.</p>
      ) : (
        <ul>
          {medicines.map((m) => (
            <li key={m._id}>
              <strong>{m.name}</strong> — Status:{" "}
              <span
                style={{
                  color:
                    m.lastStatus === "Taken"
                      ? "green"
                      : m.lastStatus === "Missed"
                      ? "red"
                      : "gray",
                }}
              >
                {m.lastStatus}
              </span>{" "}
              (Taken: {m.takenCount}, Missed: {m.missedCount})
            </li>
          ))}
        </ul>
      )}

      <h2>📊 Performance Overview</h2>
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
