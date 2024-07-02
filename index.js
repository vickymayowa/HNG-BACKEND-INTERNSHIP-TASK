import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  if (!visitorName || visitorName.trim() === "") {
    return res.status(400).json({ message: "Visitor Name is Required" });
  }
  const OPENWEATHERMAP_API_KEY = process.env.API_WEB_KEY;
  try {
    const ipResponse = await axios.get("https://get.geojs.io/v1/ip/geo.json");

    if (!ipResponse.data.city) {
      throw new Error("City not found in IP response");
    }

    const CITY_NAME = ipResponse.data.city;
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
    );

    if (!weatherResponse.data.main || !weatherResponse.data.main.temp) {
      throw new Error("Temperature not found in weather response");
    }

    const temperature = weatherResponse.data.main.temp;
    const greeting = `Hello, ${visitorName}, The temperature is ${temperature} degrees Celsius in ${CITY_NAME}.`;

    res.json({
      client_ip: ipResponse.data.ip,
      location: CITY_NAME,
      temperature,
      greeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
