const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/carrers")
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));
