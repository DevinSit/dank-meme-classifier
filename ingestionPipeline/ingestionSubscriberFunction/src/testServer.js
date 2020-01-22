const express = require("express");
const bodyParser = require("body-parser");
const {ingestionSubscriberFunctionTest} = require("./index.js");

const PORT = 8082;

const app = express();

app.use(bodyParser.json());
app.post("/", ingestionSubscriberFunctionTest);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
