const util = require("util");
const redis = require("redis");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

exports.handleCache = async (key, cb) => {
  //convert to a promise
  client.get = util.promisify(client.get);

  //check if there is any cached data in redis related to this query
  const cachedData = await client.get(key);

  //if there is then response to the request right away and return
  if (cachedData) {
    console.log("SERVING FROM CACHE");

    return res.send(JSON.parse(cachedData));
  }

  // ************from here got stuck **************************

  //if not, we need to respond to the request & update our cache to store the data
  const blogs = await Blog.find({ _user: req.user.id });
  console.log("SERVING FROM MONGODB");

  res.send(blogs);
  client.set(req.user.id, JSON.stringify(blogs));
};

//#region
/* 

const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

const redisValues = {
  hi: "there",
};

const redisHashValues = {
  spanish: {
    red: "rojo",
    orange: "naraja",
    blue: "azul",
  },
  german: {
    red: "rot",
    orange: "orange",
    blue: "blau",
  },
};

// client.set('hi','there')
// client.get('hi)

client.hset("german", "red", "rot");
client.hget("german", "red", console.log);

client.set("colors", JSON.stringify({ red: "rojo" }));
client.get("colors", (err, val) => console.log(JSON.parse(val)));
*/
//#endregion

//COMMANDS
/**
 * keys *  --get all keys
 * flushall  --remove all keys from all databases
 */
