const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const app = express();

const renderApp = (req, res) => {
    const filePath = path.resolve(__dirname, "..", "build", "index.html");

    fs.readFile(filePath, "utf8", (err, htmlData) => {
        if (err) {
            console.error("read error", err);
            res.sendStatus(404);
        }

        const rendered = htmlData.replace("__BACKEND_HOST__", `${process.env.BACKEND_HOST}`)
                                 .replace("__BACKEND_PORT__", `${process.env.BACKEND_PORT}`)
                                 .replace("__BACKEND_PROTOCOL__", "https");

        res.send(rendered);
    });
};

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.get("/", renderApp);
app.use(express.static(path.resolve(__dirname, "..", "build")));
app.get("*", renderApp);

module.exports = app;
