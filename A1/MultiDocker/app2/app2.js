const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/definition", (req, res) => {
  console.log(`---${req.body}`);
  const { word } = req.body;
  console.log(word);
  console.log(JSON.stringify(word));
  var result = null;

  var fs = require("fs"),
    readline = require("readline");

  var read = readline.createInterface({
    input: fs.createReadStream("/etc/data/dictionary.txt"),
    console: false,
  });

  read.on("line", function (line) {
    var lineArray = line.split("=");
    if (lineArray[0].trim() == word.trim()) {
      result = lineArray[1];
      console.log("result--" + result);
    }
  });
  setTimeout(function () {
    console.log("result-----" + result);
    if (result != null) {
      res.json({ word: word, definition: result });
    } else {
      res.json({ word: word, error: "Word not found in dictionary." });
    }
  }, 500);
});

app.listen(port);
