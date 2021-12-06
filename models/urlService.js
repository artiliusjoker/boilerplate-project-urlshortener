const { URL } = require("./urlModel");
exports.createNewUrl = async (currURL, oldUrl) => {
  const newShortUrl = new URL({
    shortURL: currURL,
    originalURL: oldUrl,
  });
  await newShortUrl.save();
  return newShortUrl;
};
exports.findExistedUrl = async (oldUrl) => {
  return await URL.findOne({ originalURL: oldUrl });
};
exports.findHighest = function () {
  return URL.find().sort("-shortURL").limit(1).exec();
};
exports.getOriginalUrl = async (shortURL) => {
  return await URL.findOne({ shortURL: shortURL });
};
