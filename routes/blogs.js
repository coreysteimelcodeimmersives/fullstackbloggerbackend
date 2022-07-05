var express = require("express");
var router = express.Router();

router.get("/hello-blogs", (req, res) => {
  res.json({ message: "hello from express" });
});

module.exports = router;
