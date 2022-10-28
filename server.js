const express = require('express');
const bodyParser = require('body-parser');

const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require('morgan');
const logger = require('./winston');

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


const myStream = {
  write: text => {
    logger.info(text);
  }
};
app.use(morgan('combined', { stream: myStream }));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Api Gateway",
    description: "API gateway",
    version: "0.1",
  },
  servers: [{ url: "http://localhost:5000", description: "" }]
};

const options = { swaggerDefinition, apis: ["./docs/**/*.yaml"] };
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// simple route
app.get("/ping", (req, res) => {
  res.send('pong').status(200);
});


require("./src/routes/GatewayRoutes")(app);

app.listen(5000, () => {
  console.log('is connected');
});

module.exports = app;