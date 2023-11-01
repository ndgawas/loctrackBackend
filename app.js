require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/cords", require("./routes/cords"));
app.use("/api/v1/logs", require("./routes/logs"));
app.use("/api/v1/text", require("./routes/text"));

connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
  });
});
