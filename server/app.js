require("dotenv").config();
require("./config/database");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
require("./config/passport");

app.use("/user", require("./routes/user"));
app.use("/dashboard", require("./routes/dashboard"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
