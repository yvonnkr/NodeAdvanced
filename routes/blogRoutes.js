const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const cleanCache = require("./../middlewares/cleanCache");
const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  //@route using cache
  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id,
    });

    res.send(blogs);
  });

  //#region simple cache example
  /* 
    app.get("/api/blogs", requireLogin, async (req, res) => {
      const util = require("util");
      const redis = require("redis");
      const redisUrl = "redis://127.0.0.1:6379";
      const client = redis.createClient(redisUrl);

      client.get = util.promisify(client.get); //convert to a promise

      //check if there is any cached data in redis related to this query
      const cachedBlogs = await client.get(req.user.id);

      //if there is then response to the request right away and return
      if (cachedBlogs) {
        console.log("SERVING FROM CACHE");

        return res.send(JSON.parse(cachedBlogs));
      }

      //if not, we need to respond to the request & update our cache to store the data
      const blogs = await Blog.find({ _user: req.user.id });
      console.log("SERVING FROM MONGODB");

      res.send(blogs);
      client.set(req.user.id, JSON.stringify(blogs));
    });

  */
  //#endregion

  app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const blog = new Blog({
      title,
      content,
      imageUrl,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }

    // clearHash(req.user.id); //created a middleware instead
  });
};
