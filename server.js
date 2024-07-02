const express = require("express");
const axios = require("axios");
// require("dotenv").config();

const app = express();
const PORT = 4000;
API_KEY = "641a46e3b36d4074b20194327240107";

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // Get location data
    const locationResponse = await axios.get(
      `http://ip-api.com/json/${clientIp}`
    );
    const location = locationResponse.data;
    console.log(location);
    //console.log("Location Data:", location);

    // Check if location.city is defined
    if (!location.city) {
      throw new Error("City not found in location data");
    }

    // Get weather data
    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=lagos`
    );
    const weather = weatherResponse.data;
    console.log("Weather Data:", weather);

    const response = {
      client_ip: clientIp,
      location: location.city,
      greeting: `Hello, ${visitorName}! The temperature is ${weather.current.temp_c} degrees Celsius in lagos.`,
    };

    res.json(response);
  } catch (error) {
    console.error(error); // Log the error details to the console
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
