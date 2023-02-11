// install express with `npm install express`
const express = require("express");
const app = express();
const axios = require("axios");
const { parse } = require("node-html-parser");
const cors = require('cors');

const URLS = {
  results: "https://exams.keralauniversity.ac.in/Login/check8",
  notifications: "https://exams.keralauniversity.ac.in/Login/check1",
};

/**
 *
 * @param {HTMLElement} each
 * @returns
 */
const linkAndText = (each) => {
  const date = each.textContent.slice(-10);
  const data = findUntilTableHeading(each.nextElementSibling, date, []);
  return data;
};

/**
 *
 * @param {HTMLElement} tag
 * @param {string} date
 * @param {[]} textList
 * @returns {{date: string, textList: []}}
 */
const findUntilTableHeading = (tag, date, textList = []) => {
  if (tag.classList && tag.classList.contains("tableHeading")) {
    return { date, textList };
  } else {
    if (
      tag.querySelector("a[href]") &&
      !tag.textContent.trim().startsWith("<<")
    ) {
      textList.push({
        title: tag.textContent.trim(),
        link: tag.querySelector("a[href]").getAttribute("href"),
      });
    }
    if (tag.nextElementSibling?.tagName.toLowerCase() === "tr") {
      console.log(
        'tag.nextElementSibling.tagName === "tr"',
        tag.nextElementSibling.tagName === "tr"
      );
      return findUntilTableHeading(tag.nextElementSibling, date, textList);
    }
    return { date, textList };
  }
};

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

app.listen(3001, () => console.log("Example app listening on port 3000!"));

// export 'app'
module.exports = app;
