/**NOTE: --Caching logic depends alot on the structure of your code so, this logic here might not neccessarily fit with any structure, might need to make changes.... */

const mongoose = require("mongoose");
const util = require("util");
const redis = require("redis");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

//copy of original mongoose exec func
const exec = mongoose.Query.prototype.exec;

//add our own cache property  --to use to decide if to cache query or not
mongoose.Query.prototype.cache = async function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

//overwrite existing func defined by mongoose and serve in our own custom implementation
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    // console.log("1 FETCHED FROM MONGODB");

    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //check if we have a value for key in redis
  const cacheValue = await client.hget(this.hashKey, key);

  //if we do return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    // console.log("2 FETCHED FROM CACHE");

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  //otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.hmset(this.hashKey, key, JSON.stringify(result), "EX", 10);
  //   client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10); //hset throws error used hmset instead
  // console.log("3 FETCHED FROM MONGODB");

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
