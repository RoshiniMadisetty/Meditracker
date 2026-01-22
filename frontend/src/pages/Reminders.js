// src/pages/Reminders.js
import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*
  Robust Reminders component:
  - Handles reminderTime as "HH:mm" OR ISO string.
  - Triggers notification ±30s window.
  - Auto-marks Missed if > 60s past reminder and still Pending.
  - Lets user override Missed -> Taken.
  - Uses an audio element with id "notif-audio" (preload) in public/index.html or App.
*/

const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Notifications not supported by this browser");
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    console.log("Notification permission:", perm);
  } catch (err) {
    console.warn("Notification request failed:", err);
  }
};

export default function Reminders() {
  const [medicines, setMedicines] = useState([]);
  const medsRef = useRef([]); // reliable current list
  const notifiedSet = useRef(new Set()); // track which ids we've notified in this session

  const fetchReminders = async () => {
    try {
      const res = await API.get("/medicines");
      console.log("Fetched medicines:", res.data);
      setMedicines(res.data);
      medsRef.current = res.data;
    } catch (err) {
      console.error("Fetch reminders failed:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
    // refresh list every 60s so changes propagate
    const rInt = setInterval(fetchReminders, 60000);
    return () => clearInterval(rInt);
  }, []);

  // Helper: parse reminder time (returns Date of next occurrence today with that time)
  const parseReminderToDate = (m) => {
    if (!m.reminderTime) return null;

    // If stored as "HH:mm"
    if (/^\d{1,2}:\d{2}$/.test(m.reminderTime)) {
      const [h, mm] = m.reminderTime.split(":").map((x) => parseInt(x, 10));
      const dt = new Date();
      dt.setHours(h, mm, 0, 0);
      return dt;
    }

    // If stored as ISO date/time string
    const maybeISO = new Date(m.reminderTime);
    if (!isNaN(maybeISO.getTime())) return maybeISO;

    // unknown format
    return null;
  };

  // core checker: runs independently on interval
  useEffect(() => {
    const checkAll = async () => {
      const now = new Date();
      const meds = medsRef.current || [];
      // console.log("Checker tick", now.toLocaleTimeString());

      for (const m of meds) {
        const reminderDate = parseReminderToDate(m);
        if (!reminderDate) continue;

        const diffMs = now - reminderDate; // positive if now is after reminder
        // debug
        //console.log(`med ${m._id} (${m.name}) diffMs: ${diffMs} lastStatus:${m.lastStatus}`);

        // Notification window ±30s
        if (Math.abs(diffMs) <= 30000 && (m.lastStatus === "Pending" || !m.lastStatus)) {
          if (!notifiedSet.current.has(m._id)) {
            console.log("Triggering reminder for", m.name, "diffMs", diffMs);
            triggerNotification(m);
            notifiedSet.current.add(m._id);
          }
        }

        // Auto-mark missed after > 60 seconds if status still Pending
        if (diffMs > 60000 && (m.lastStatus === "Pending" || !m.lastStatus)) {
          console.log("Auto-mark missed for", m.name, "diffMs", diffMs);
          try {
            await API.post(`/medicines/${m._id}/missed`);
            // update local state
            setMedicines((prev) =>
              prev.map((x) =>
                x._id === m._id ? { ...x, lastStatus: "Missed", missedCount: (x.missedCount || 0) + 1 } : x
              )
            );
            // also update ref list
            medsRef.current = medsRef.current.map((x) =>
              x._id === m._id ? { ...x, lastStatus: "Missed", missedCount: (x.missedCount || 0) + 1 } : x
            );
            toast.warning(`Auto-marked missed: ${m.name}`);
          } catch (err) {
            console.error("Auto-miss API error", err);
          }
        }
      }
    };

    const id = setInterval(checkAll, 15000);
    // also run immediately once
    checkAll().catch((e) => console.error(e));
    return () => clearInterval(id);
  }, []);

  // Notification + play audio
  const triggerNotification = (m) => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("MediTracker", {
          body: `Time to take ${m.name}`,
          icon: "/favicon.ico",
        });
      }
    } catch (err) {
      console.warn("Notification error:", err);
    }

    // toast
    toast.info(`Time: ${m.name}`, { autoClose: 5000 });

    // play audio using audio element (preloaded)
    try {
      const audioEl = document.getElementById("notif-audio");
      if (audioEl) {
        const p = audioEl.play();
        if (p && p.catch) p.catch((err) => console.warn("Audio play blocked until user interacts:", err));
      } else {
        // fallback play new Audio
        const a = new Audio("/notification.mp3");
        a.play().catch((err) => console.warn("Audio play blocked:", err));
      }
    } catch (err) {
      console.warn("Audio trigger failed:", err);
    }
  };

  // Manual actions (override)
  const handleAction = async (id, action) => {
    try {
      await API.post(`/medicines/${id}/${action}`);
      setMedicines((prev) =>
        prev.map((m) =>
          m._id === id
            ? {
                ...m,
                lastStatus: action === "taken" ? "Taken" : "Missed",
                takenCount: action === "taken" ? (m.takenCount || 0) + 1 : m.takenCount || 0,
                missedCount: action === "missed" ? (m.missedCount || 0) + 1 : m.missedCount || 0,
              }
            : m
        )
      );
      // update ref as well
      medsRef.current = medsRef.current.map((m) =>
        m._id === id
          ? {
              ...m,
              lastStatus: action === "taken" ? "Taken" : "Missed",
              takenCount: action === "taken" ? (m.takenCount || 0) + 1 : m.takenCount || 0,
              missedCount: action === "missed" ? (m.missedCount || 0) + 1 : m.missedCount || 0,
            }
          : m
      );
      toast.success(`Marked ${action}`);
      // allow marking again if late taker: clear notified so sound could be re-triggered next time if needed
      if (action === "taken") notifiedSet.current.delete(id);
    } catch (err) {
      console.error("Action API error", err);
      toast.error("Action failed");
    }
  };

  // user click to enable permission & sound
  const enableNotificationsAndSound = async () => {
    await requestNotificationPermission();
    const audioEl = document.getElementById("notif-audio");
    if (audioEl) {
      audioEl.play().then(() => {
        audioEl.pause();
        audioEl.currentTime = 0;
        console.log("Audio unlocked by user interaction");
      }).catch((e) => {
        console.warn("Audio unlock catch:", e);
      });
    }
    toast.success("Notifications enabled (if permitted)");
  };

  return (
    <div style={{ padding: 30 }}>
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>⏰ Today's Reminders</h1>
        <div>
          <button onClick={enableNotificationsAndSound} style={{ padding: "8px 12px" }}>
            Enable Notifications & Sound
          </button>
        </div>
      </div>

      {medicines.length === 0 ? (
        <p>No reminders</p>
      ) : (
        medicines.map((m) => (
          <div key={m._id} style={{ background: "#fff", margin: "12px 0", padding: 18, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{m.name}</h3>
                <div style={{ color: "#444" }}>
                  Reminder at: {m.reminderTime || "—"} —{" "}
                  <b style={{ color: m.lastStatus === "Taken" ? "green" : m.lastStatus === "Missed" ? "red" : "gray" }}>
                    {m.lastStatus || "Pending"}
                  </b>
                </div>
              </div>

              <div>
                <button onClick={() => handleAction(m._id, "taken")} disabled={m.lastStatus === "Taken"} style={{ marginRight: 8 }}>
                  Mark as Taken
                </button>
                <button onClick={() => handleAction(m._id, "missed")} disabled={m.lastStatus === "Missed"}>
                  Mark as Missed
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
