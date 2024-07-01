const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const temperature = 11;
  if (!visitorName || visitorName.trim() === "") {
    return res.status(400).json({ message: "Visitor Name is Required" });
  }
  try {
    const ipResponse = await axios.get(
      "https://get.geojs.io/v1/ip/country.json"
    );
    const greeting = `Hello, ${visitorName}, The temperature is ${temperature} degrees Celsius in ${ipResponse.data.name}`;
    res.json({
      client_ip: ipResponse.data.ip,
      location: ipResponse.data.name,
      greeting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
