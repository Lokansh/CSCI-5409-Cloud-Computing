const express = require("express");
const bodyParser = require("body-parser");
//var AWS = require("aws-sdk");
var mysql = require("mysql");
const { query } = require("express");

const app = express();
const port = process.env.PORT || 7000;
var connection;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//https://console.aws.amazon.com/secretsmanager/.
//Got secret manager code snippet from the above link.

var AWS = require("aws-sdk"),
  region = "us-east-1",
  secretName = "RDS_Credentials",
  secret,
  decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region,
  accessKeyId: "*****",
  secretAccessKey: "*****",
  sessionToken:
    "*****",
});

//https://stackoverflow.com/questions/57618689/how-do-i-use-aws-secret-manager-with-nodejs-lambda
//Modified Secret manager code from this source
start();
async function start() {
  const result = await client
    .getSecretValue({
      SecretId: secretName,
    })
    .promise();

  const secretJSON = JSON.parse(result.SecretString);
  console.log("secretJSON" + JSON.stringify(secretJSON));

  //https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-nodejs.rds.html
  //Referred this documentation for establishing connection.
  connection = mysql.createConnection({
    host: "database-1-instance-1.czjvisj5ughh.us-east-1.rds.amazonaws.com",
    user: secretJSON.DBUsername,
    password: secretJSON.DBPassword,
    port: "3306",
  });

  connection.connect(function (err) {
    if (err) {
      console.log("Database connection failed: " + err.stack);
    }
    console.log("Successful connection established");
  });
}

app.get("/", (_, res) => {
  res
    .status(200)
    .send(
      "<html><body><h1> Node JS application is working on EC2</h1></body></html>"
    );
});

app.post("/storestudents", (req, res) => {
  //console.log(JSON.stringify(req.body));
  //https://stackabuse.com/using-aws-rds-with-node-js-and-express-js/
  //Used this example to query on database.

  if (req.body.students.length > 0) {
    console.log("Post Request received");
    //https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js
    //Modified this JS map example to parse multiple insert record values from json array obejct to array for inserting data into Aurora database
    connection.connect(function (err) {
      var sql =
        "INSERT INTO assignment.students (first_name, last_name, banner) VALUES ?";
      connection.query(
        sql,
        [
          req.body.students.map((item) => [
            item.first_name,
            item.last_name,
            item.banner,
          ]),
        ],
        function (err, result, fields) {
          if (err) res.status(400).send("Error - " + JSON.stringify(err));
          if (result)
            res.status(200).send("Success - " + JSON.stringify(result));
          if (fields) console.log(fields);
        }
      );
    });
  } else {
    res.status(400).send("Please provide some data into students JSON array");
  }
});

//https://stackoverflow.com/questions/46722092/expressjs-passing-parameters-to-html-doesnt-work/46722250#46722250
//Modified this template to display HTML page in get request response when displaying all users from database

//https://sebhastian.com/javascript-print-array/#:~:text=To%20print%20an%20array%20of,tag%20in%20your%20HTML%20page.&text=And%20that's%20how%20you%20can,elements%20to%20the%20web%20page.
//Modified this Javascript example to display records in a meaningful form
const studentsDislayPage = (data) => {
  return `
     <!DOCTYPE html>
     <html>
       <head>
       </head>
       <body>

        <h1>Student table records</h1>
        <h3 id = "records"></h3>
        
        <script type="text/javascript">
        let studentRecords = ${JSON.stringify(data)};
        document.getElementById("records").innerHTML = JSON.stringify(studentRecords, null, 2);
        </script>

       </body>
     </html>`;
};

app.get("/liststudents", (_, res) => {
  console.log("Get Request received");
  //https://stackabuse.com/using-aws-rds-with-node-js-and-express-js/
  //modified this example for select query
  connection.connect(function (err) {
    connection.query(
      `SELECT * FROM assignment.students`,
      function (err, result, fields) {
        if (err) res.status(400).send("Error - " + JSON.stringify(err));
        if (result) res.status(200).send(studentsDislayPage(result));
      }
    );
  });
});

app.listen(port, () => console.log(`Listening on custom ${port}`));
