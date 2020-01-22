const express = require("express");
const bodyParser = require("body-parser");
const {ingestionPublisherFunction} = require("./index.js");

const PORT = 8081;

const app = express();

app.use(bodyParser.json());
app.post("/", ingestionPublisherFunction);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
