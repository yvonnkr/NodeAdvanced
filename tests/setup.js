jest.setTimeout(30000); //default 5000

require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

afterAll(() => {
  mongoose.disconnect();
});

/*  In package.json setup  to run this setup file
    "jest": {
        "setupTestFrameworkScriptFile": "./tests/setup.js"
     }
*/
