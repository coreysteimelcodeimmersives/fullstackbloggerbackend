var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");

router.get("/hello-blogs", (req, res) => {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder === "ASC" ? Number(1) : Number(-1);
    const filterField = req.query.filterField;
    const filterValue = req.query.filterValue;
    const collection = await blogsDB().collection("posts50");
    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      sortObj = { [sortField]: sortOrder };
    }
    console.log("filterobj", filterObj);
    console.log("sortObj", sortObj);
    const posts = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    res.json({ message: posts });
  } catch (e) {
    res.status(500).json("Error fetching posts." + e);
  }
});

module.exports = router;
