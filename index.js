// install express with `npm install express`
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require('cors');
const { parse } = require("node-html-parser");

const { linkAndText } = require("./utils");
const { URLS } = require("./constants");

const port = process.env.PORT || 4201

app.use(cors())

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/results", async (req, res) => {
  const { data } = await axios.get(URLS.results);
  const root = parse(data);
  const results = root
    .querySelectorAll("tr.tableHeading")
    .map(linkAndText)
    .filter((each) => each);
  res.json(results);
});

app.get("/notifications", async (req, res) => {
  const { data } = await axios.get(URLS.notifications);
  const root = parse(data);
  const notifications = root
    .querySelectorAll("tr.tableHeading")
    .map(linkAndText)
    .filter((each) => each);
  res.json(notifications);
});

app.listen(port, () => {
  console.log(`Space App running locally on port ${port}`)
})

// export 'app'
module.exports = app;
