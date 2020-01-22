const {postScraperFunction} = require("./index.js");
const express = require("express");

const PORT = 8080;

const app = express();

app.get("/", postScraperFunction);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
