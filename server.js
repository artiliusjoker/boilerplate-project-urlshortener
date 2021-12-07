require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// connect mongo db
const connectMongo = async function () {
  await mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("connected database");
    }
  );
};
connectMongo().catch((err) => console.log(err));
const urlService = require("./models/urlService");

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// /api/shorturl
const urlRegex = /^(http|https)\:\/\/(www\.)?[a-zA-Z]*\.?[a-zA-Z]*/;
app
  .route("/api/shorturl/:url?")
  .post(async (req, res) => {
    const url = req.body.url;
    if (!urlRegex.test(url)) {
      res.json({ error: "invalid url" });
      return;
    }
    // check existed
    const existedURL = await urlService.findExistedUrl(url);

    if (existedURL !== null) {
      res.json({
        original_url: existedURL.originalURL,
        short_url: existedURL.shortURL,
      });
      return;
    }
    // find current shortened url
    const data = await urlService.findHighest();
    const highest = data[0];
    let shortURL;
    if (highest === undefined) {
      shortURL = 1;
    } else {
      shortURL = highest.shortURL + 1;
    }
    // create new url
    await urlService.createNewUrl(shortURL, url);
    // res json
    res.json({ original_url: url, shortURL: shortURL });
  })
  .get(async (req, res) => {
    const url = Number(req.params.url);
    if (isNaN(url)) {
      res.json({ error: "invalid url" });
      return;
    }
    const getUrl = await urlService.getOriginalUrl(url);
    res.redirect(getUrl.originalURL);
  });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
