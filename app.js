const express = require('express')
const app = express()
const connectDB = require("./config/db")
require("dotenv").config();
const router = require("./routes/index");
const cookieParser = require('cookie-parser');
const port = process.env.PORT

app.use(cookieParser());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



//Routes
app.use("/api", router)


//connect to DB
connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})