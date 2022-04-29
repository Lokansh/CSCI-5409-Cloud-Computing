const express = require("express");
const bodyParser = require("body-parser");
var AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "ASIAYNEV22CIG7LCEI5W",
  secretAccessKey: "i7hLR28pIAAAEcfgIzLNTiPT3q1RNJtZbKLtbdLq",
  sessionToken:
    "FwoGZXIvYXdzEAAaDNGADxx7pWdOAFoRqyLAAem+kzXEIGig8NAZLKT/X1NyPYyICYlheDN+rbqrMAqiHAZcXtYwzZh0TQE6JJEqjTLp6dmmtD7sMva8coTe3+QXXracXbmg+ka9LbVr0K+jbwePMPGZmbe+v4pUFWy/u+suDEyHoSzckG7MlFU1PoUdsVC/mIGd6X1TN/5rg+fOVeSEiDOF6LL6MJlQ8+ZhRCwUAMmw/y83Ej8bJCFVCrh1/jSpTK80ygQVOOPC+94Z4taOylLl7v3BvDbi5rUSEijK4YaRBjItqtc1zrap1PowJw8MZhQtMpNsBlCIO0Ls+ao+4bLRpXrzSq5Lbix23ejHCAiD",
  region: "us-east-1",
});

const app = express();
const port = process.env.PORT || 7777;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("Application is ready");
});

app.post("/storedata", (req, res) => {
  console.log(JSON.stringify(req.body));
  //https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
  //Modifying this example to upload file to S3 Bucket
  const params = {
    Bucket: "lokanshgupta",
    Key: "file.txt",
    Body: req.body.data,
    ACL: "public-read",
  };
  s3.upload(params, function (error, data) {
    console.log(error, data);
    if (error) {
      throw error;
    } else {
      //https://stackoverflow.com/questions/26066785/proper-way-to-set-response-status-and-json-content-in-a-rest-api-made-with-nodej?rq=1
      //Modified one example from this to send status code and JSON in return response.
      res.status(200).send({ s3uri: data.Location });
    }
  });
});

app.listen(port, () => console.log(`Listening on custom ${port}`));
