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
    const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
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

router.post("/blog-submit", async (req, res) => {
  try {
    const collection = await blogsDB().collection("posts50");
    const sortedBlogArr = await collection.find({}).sort({ id: 1 }).toArray();
    const lastBlog = sortedBlogArr[sortedBlogArr.length - 1];
    const title = req.body.title ? req.body.title : "";
    const text = req.body.text ? req.body.text : "";
    const author = req.body.author ? req.body.author : "";
    const category = req.body.category ? req.body.category : "";
    const blogPost = {
      title: title,
      text: text,
      author: author,
      category: category,
      createdAt: new Date(),
      lastModified: new Date(),
      id: Number(lastBlog.id + 1),
    };
    await collection.insertOne(blogPost);
    res.status(200).send("Successfully Posted");
  } catch (error) {
    res.status(500).send("Error posting blog." + error);
  }
});

module.exports = router;
