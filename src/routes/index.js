var express = require("express");
var router = express.Router();
const { test } = require("../utils/predictions");
/* GET home page. */
router.get("/", async function (req, res, next) {
  var data = await test();
  console.log(data);
  res.render("index", { title: "Express", data: data });
});

module.exports = router;
