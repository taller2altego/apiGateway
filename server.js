const express = require('express');
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "ApiGateway" });
});


require("./src/routes/GatewayRoutes")(app);

app.listen(5000, () => {
  console.log('is connected');
});

module.exports = app;