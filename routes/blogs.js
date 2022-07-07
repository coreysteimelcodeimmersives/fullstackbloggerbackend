var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");

router.get("/hello-blogs", (req, res) => {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async (req, res) => {
  try {
    const collection = await blogsDB().collection("posts50");
    const posts = await collection.find({}).toArray();
    res.json(posts);
  } catch (e) {
    res.status(500).send("Error fetching posts." + e);
  }
});

module.exports = router;
