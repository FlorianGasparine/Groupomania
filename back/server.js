const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const path = require("path");
const helmet = require("helmet");

const express = require("express");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

// Utilisation de tous les middlewares d'helmet (15)
app.use(helmet());

//Server
app.listen(process.env.PORT, () => {
  console.log(`Listening : ${process.env.PORT}`);
});

module.exports = app;
