const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const response = [];
var furtherRequest = [];
var result = "";

app.get("/", (_, res) => {
  res.send("Your app is ready");
});

app.post("/definition", (req, res) => {
  console.log(`---${req.body}`);
  console.log(JSON.stringify(req.body));
  console.log(Object.keys(req.body).length);
  if (!Object.keys(req.body).length == 0) {
    console.log("inside");
    const { word } = req.body;
    if (
      Object.values(word) == ""
      //|| Object.values(word) == "null"
      //|| Object.values(word) == "undefined"
    ) {
      res.json({ word: null, error: "Invalid JSON input." });
    } else {
      result = word.trim().toLowerCase();
      console.log(result);

      callFunction({ word: result });
      console.log("---f-gdfgf-gdfgd---" + furtherRequest);
      setTimeout(function () {
        res.json(furtherRequest);
      }, 1000);
    }
  } else {
    res.json({ word: null, error: "Invalid JSON input." });
  }
});

async function callFunction() {
  console.log("Inside of myfunction");
  const response = await fetch("http://c2:3000/definition", {
    method: "post",
    body: JSON.stringify({ word: result }),
    //body: JSON.stringify(furtherRequest),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  console.log(data);
  furtherRequest = [];
  furtherRequest.push(data);
  console.log("isnideeee --- " + furtherRequest);
}

app.listen(port);
