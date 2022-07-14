var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");
const { serverCheckBlogIsValid } = require("../utils/validation");

router.get("/blog-list", async (req, res, next) => {
  try {
    const collection = await blogsDB().collection("posts50");
    const blogs = await collection
      .find({})
      .sort({ id: -1 })
      .project({
        id: 1,
        title: 1,
        author: 1,
        createdAt: 1,
        lastModified: 1,
        category: 1,
      })
      .toArray();
    res.status(200).json({ message: blogs, succes: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to load" + error, success: false });
  }
});

router.put("/edit-blog", async (req, res) => {
  try {
    const updateBlogIsValid = serverCheckBlogIsValid(req.body);
    if (!updateBlogIsValid) {
      res
        .status(400)
        .json({ message: "Blog update is not valid", success: false });
      return;
    }
    const collection = await blogsDB().collection("posts50");
    const blogId = Number(req.body.id);
    const ogBlog = await collection.findOne({ id: blogId });
    if (!ogBlog) {
      res.json({ message: "Blog does not Exist", status: 204 });
    }
    const newPostData = req.body;
    const date = new Date();
    const updateBlog = { ...newPostData, lastModified: date };
    console.log(updateBlog);

    await collection.updateOne(
      { id: newPostData.id },
      { $set: { ...updateBlog } }
    );
    console.log("should work");
    res.status(200).json({ message: "Blog update succes", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating blog" + error, success: false });
  }
});

router.delete("/delete-blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("posts50");
    const blogToDelete = await collection.deleteOne({ id: blogId });
    if (blogToDelete.deletedCount === 1) {
      res.json({ message: "Successfully Deleted", success: true }).status(200);
    } else {
      res.json({ message: "Unsuccessful", success: false }).status(204);
    }
  } catch (error) {
    res.status(500).json({ message: "Error " + error, success: false });
  }
});

module.exports = router;
