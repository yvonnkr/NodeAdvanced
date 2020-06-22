const AWS = require("aws-sdk");
const { v1: uuidV1 } = require("uuid");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

// configure S3
const s3 = new AWS.S3({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSectretAccessKey,
  signatureVersion: "v4",
  region: "eu-west-2",
});

module.exports = (app) => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuidV1()}.jpeg`;

    const params = {
      Bucket: "yvonnkr-awsbucket2",
      ContentType: "image/jpeg",
      Key: key,
    };

    s3.getSignedUrl("putObject", params, (err, url) => {
      if (err) {
        return res.send(err);
      }

      res.send({ key, url });
    });
  });
};
