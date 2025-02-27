import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8089/device-info");

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

    fetchData();
  }, []);

  return (
    <div>
      <h1>Fetching Device Info</h1>
      <p>Check the console for results. {JSON.stringify(data)}</p>
    </div>
  );
};

export default App;
