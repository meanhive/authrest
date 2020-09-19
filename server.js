const express = require("express");
const cors = require("cors");
const assert = require("assert");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const mongoose = require("mongoose");
const authRoute = require("./route/auth.route");
const mongoConfig = require("./config/Db");
const PORT = Number(process.env.PORT || 3344);

const app = express();

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cors
app.use(cors());

// mongo db connection
mongoose.Promise = global.Promise;
mongoose
  .connect(mongoConfig.prod, { useNewUrlParser: true })
  .then((res) => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

app.use(
  expressSession({
    secret: process.env.SECRET || require("./config.json").secret,
    saveUninitialized: true,
    resave: true,
  })
);

app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`app is running at http://localhost:${PORT}/auth`);
});
