import React, { useEffect, useState } from "react";

function App() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userDataParam = urlParams.get("userData");

    if (userDataParam) {
      try {
        // Decode and parse the userData
        const decoded = JSON.parse(decodeURIComponent(userDataParam));
        setUserData(decoded);

        // Optional: Acknowledge receipt back to the React Native app
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "DATA_RECEIVED",
              success: true,
              timestamp: Date.now(),
            })
          );
        }
      } catch (err) {
        console.error("Error decoding userData:", err);
        setError("Failed to decode user data");
      }
    } else {
      // Check if there's a token parameter as fallback
      const token = urlParams.get("token");

      if (token) {
        try {
          // Handle JWT token format if present
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setUserData(decoded);
        } catch (err) {
          console.error("Error decoding token:", err);
          setError("Failed to decode token");
        }
      } else {
        setError("No user data or token found in URL");
      }
    }
  }, []);

  // Function to send data back to React Native
  const sendDataToApp = (data) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } else {
      console.log("ReactNativeWebView not available", data);
    }
  };

  return (
    <div
      className="container"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      {userData && (
        <div>
          <h2>User Data Received</h2>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>Unique ID:</strong> {userData.uniqueId}
            </p>
            <p>
              <strong>Device Unique ID:</strong> {userData.deviceUniqueId}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(userData.timestamp).toLocaleString()}
            </p>
          </div>

          <button
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() =>
              sendDataToApp({
                type: "USER_ACTION",
                message: "User acknowledged data receipt",
                timestamp: Date.now(),
              })
            }
          >
            Confirm Data Receipt
          </button>
        </div>
      )}

      {!userData && !error && (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <p>Waiting for data...</p>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #3498db",
              borderRadius: "50%",
              margin: "20px auto",
              animation: "spin 2s linear infinite",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          <p>Error: {error}</p>
          <p>Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
}

export default App;
