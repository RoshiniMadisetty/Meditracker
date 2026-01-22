import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import './AddMedicine.css'; // optional for styling

export default function AddMedicine() {
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    times: ['08:00'], // 24-hour format default
    startDate: '',
    endDate: '',
  });
  const navigate = useNavigate();

  // ✅ Add new time field
  const addTime = () =>
    setForm({ ...form, times: [...form.times, ''] });

  // ✅ Handle time input update
  const setTime = (i, val) => {
    const t = [...form.times];
    t[i] = val;
    setForm({ ...form, times: t });
  };

  // ✅ Handle form submit
  const submit = async (e) => {
  e.preventDefault();
  try {
    // ✅ Convert all entered times to HH:mm (24-hour format)
    const cleanTimes = form.times.map((t) => t.slice(0, 5));
    const finalForm = { ...form, times: cleanTimes };

    // ✅ Send clean data to backend
    await API.post('/medicines', finalForm);

    alert('Medicine saved successfully!');
    navigate('/medicines');
  } catch (err) {
    console.error(err);
    alert('Error saving medicine');
  }


  };

  return (
    <form onSubmit={submit} className="medicine-card">
      <h2>Add New Medicine</h2>

      <label>Medicine Name</label>
      <input
        type="text"
        placeholder="Enter medicine name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <label>Dosage</label>
      <input
        type="text"
        placeholder="e.g. 25mg"
        value={form.dosage}
        onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        required
      />

      <label>Reminder Time (24-hour)</label>
      {form.times.map((t, i) => (
        <input
          key={i}
          type="time"
          value={t}
          onChange={(e) => setTime(i, e.target.value)}
          step="60"
          required
        />
      ))}
      <button type="button" className="add-time-btn" onClick={addTime}>
        + Add another time
      </button>

      <label>Start Date</label>
      <input
        type="date"
        value={form.startDate}
        onChange={(e) =>
          setForm({ ...form, startDate: e.target.value })
        }
        required
      />

      <label>End Date</label>
      <input
        type="date"
        value={form.endDate}
        onChange={(e) =>
          setForm({ ...form, endDate: e.target.value })
        }
        required
      />

      <button type="submit" className="save-btn">
        Save Medicine
      </button>
    </form>
  );
}
