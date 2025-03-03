import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState(null);
  const [userIp, setUserIp] = useState("");

  useEffect(() => {
    const getUserIP = async () => {
      try {
        // Fetch public IP (Alternative: 'https://api.ipify.org?format=json')
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setUserIp(ipData.ip); // Set the user's IP

        console.log("User IP:", ipData.ip);

        // Now fetch device info using the IP
        fetchData(ipData.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    const fetchData = async (ip) => {
      try {
        const response = await fetch(`http://${ip}:8089/device-info`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);

        alert("Data fetched successfully!");
        console.log("Data:", result);
      } catch (error) {
        console.error("Fetch error:", error);
        alert(`Error: ${error}`);
      }
    };

    getUserIP();
  }, []);

  return (
    <div>
      <h1>Fetching Device Info</h1>
      <p>Detected IP: {userIp || "Fetching..."}</p>
      <p>Check the console for results.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
