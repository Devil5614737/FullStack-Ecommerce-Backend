const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const data = require("./routes/products");
const signup = require("./routes/signup");
const login = require("./routes/login");
const payment=require('./routes/payment');

dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to mongodb"))
  .catch((e) => console.log(e));

app.use("/data", data);
app.use("/", signup);
app.use("/", login);
app.use("/payment", payment);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
