const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.ip === "::1" ? "127.0.0.1" : req.ip;

  try {
    // Fetch location data from IP-API
    const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
    console.log(response.data);
    const location = response.data.city || "Unknown";
    const temperature = 11; // For simplicity, we'll hardcode the temperature

    const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`;

    res.json({
      client_ip: clientIp,
      location,
      greeting,
    });
  } catch (error) {
    console.error("Error fetching location:", error);

    res.status(500).json({
      error: "Unable to fetch location",
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
