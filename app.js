const express = require("express");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config();
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());


const allowedOrigins = [
  "http://localhost:5173", // dev frontend
  "https://food-order-website-front-end.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, Postman)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allows cookies/auth headers
  })
)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Routes
app.use("/api", router);

//connect to DB
connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
