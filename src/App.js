import React, { useEffect, useState } from "react";

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserData(decoded);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  return (
    <div>
      {userData && (
        <div>
          <h2>User Data:</h2>
          <p>Unique ID: {userData.uniqueId}</p>
          <p>Device Unique ID: {userData.deviceUniqueId}</p>
          <p>Timestamp: {new Date(userData.timestamp).toLocaleString()}</p>
        </div>
      )}
      {!userData && <p>Waiting for data...</p>}
    </div>
  );
}

export default App;
