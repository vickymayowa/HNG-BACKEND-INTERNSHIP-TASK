const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  if (!visitorName || visitorName.trim() === "") {
    return res.status(400).json({ message: "Visitor Name is Required" });
  }
  const OPENWEATHERMAP_API_KEY = "abd3a67c4c331ef2c764830dfd53a59b";
  try {
    const ipResponse = await axios.get(
      "https://get.geojs.io/v1/ip/country.json"
    );

    const CITY_NAME = ipResponse.data.name;
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
    );

    const temperature = weatherResponse.data.main.temp;

    const greeting = `Hello, ${visitorName}, The temperature is ${temperature} degrees Celsius in ${ipResponse.data.name}`;
    res.json({
      client_ip: ipResponse.data.ip,
      location: ipResponse.data.name,
      temperature,
      greeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => {
  console.log("Server listening on port 3000");
});
