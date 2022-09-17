const express = require('express');
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

app.use(express.json());
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
  servers: [{ url: "http://localhost:6000", description: "" }]
};

const options = { swaggerDefinition, apis: ["./docs/**/*.yaml"] };
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "ApiGateway" });
});


require("./src/routes/GatewayRoutes")(app);

app.listen(6000, () => {
  console.log('is connected');
});

module.exports = app;