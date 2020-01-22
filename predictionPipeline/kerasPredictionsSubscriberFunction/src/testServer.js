const express = require("express");
const bodyParser = require("body-parser");
const {kerasPredictionsSubscriberFunctionTest} = require("./index.js");

const PORT = 8082;

const app = express();

app.use(bodyParser.json());
app.post("/", kerasPredictionsSubscriberFunctionTest);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
