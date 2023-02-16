require("dotenv").config();
require("express-async-errors");

// Packages
const express = require("express");
const cors = require("cors");

// Controllers
const connectDB = require("./database");

// Middleware
const authorize = require("./middleware/authentication");

// Routers
const loginRouter = require("./routes/loginSignup");
const recordRouter = require('./routes/courseActions')
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Setting up the express app
app.use(cors());
app.use(express.json());
app.use("/signup", loginRouter);
app.use("/record", [authorize], recordRouter)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log("Server started on Port " + PORT);
  await connectDB(process.env.MONGO_URI);
});
