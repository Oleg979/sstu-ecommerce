const translate = require("translate");
const sentiment = require("wink-sentiment");
const { API_KEY } = require("../config/translate.config");

translate.engine = "yandex";
translate.key = API_KEY;

const getSentimentAnalysis = async input => {
  const translated = await translate(input, { from: "ru", to: "en" });
  return sentiment(translated);
};

const getEvaluation = ({ normalizedScore }) => {
  console.log(`Sentiment = ${normalizedScore}`);
  return normalizedScore >= 3
    ? "happy"
    : normalizedScore >= 1
    ? "smile"
    : normalizedScore >= 0
    ? "meh"
    : normalizedScore >= -1
    ? "sad"
    : "pain";
};

module.exports = async input => {
  const sentiment = await getSentimentAnalysis(input);
  return getEvaluation(sentiment);
};
