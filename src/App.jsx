import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [systemTime, setSystemTime] = useState(new Date());
  const [zoneTime, setZoneTime] = useState("");
  const [selectedZone, setSelectedZone] = useState("Asia/Kolkata");
  const [timeZones, setTimeZones] = useState([]);

  // 1. Local system time update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch all available time zones from API
  useEffect(() => {
    fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones")
      .then((response) => response.json())
      .then((data) => {
        setTimeZones(data); // set all zones to dropdown
      })
      .catch((error) => {
        console.error("Error fetching time zones:", error);
      });
  }, []);

  // 3. Fetch selected zone time from API every second
  useEffect(() => {
    const fetchZoneTime = () => {
      fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(selectedZone)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.dateTime) {
            const date = new Date(data.dateTime);
            setZoneTime(date.toLocaleString());
          } else {
            setZoneTime("Failed to fetch time.");
          }
        })
        .catch((error) => {
          console.error("Error fetching zone time:", error);
          setZoneTime("Failed to fetch time.");
        });
    };

    fetchZoneTime(); // fetch once
    const interval = setInterval(fetchZoneTime, 1000); // update every second
    return () => clearInterval(interval); // cleanup
  }, [selectedZone]);

  return (
    <div className="container">
      <h2 className="title">🌍 World Clock with Time Zone API</h2>
      <div className="time-display">
        <div className="time-box">
          <h3>🕓 Local Time</h3>
          <p>{systemTime.toLocaleString()}</p>
        </div>
        <div className="time-box">
          <h3>🌐 {selectedZone} Time</h3>
          <p>{zoneTime}</p>
        </div>
      </div>

      <div className="selector">
        <label><strong>Select Time Zone:</strong></label>
        <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
          {timeZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default App;
