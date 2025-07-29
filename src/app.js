const express = require("express");
const app = express();
const dotenv = require("dotenv");
const passport = require("passport");
const configurePassport = require("./config/passport");
const cookie = require("cookie-parser");

const userRoute = require("./routes/User");
const bookRoute = require("./routes/Book");

dotenv.config();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(cookie("inirahasia"));

//passport
app.use(passport.initialize());
configurePassport(passport);

app.use("/api/users", userRoute);
app.use("/api/books", bookRoute);

app.use((req, res, next) => {
  res.status(404).send({ error: "API Not Found!" });
});

app.use((err, req, res, next) => {
  const code = res.code || 500;
  const message = err.message || "INTERNAL SERVER ERROR";
  res.status(code).json({ message });
});

module.exports = app;
