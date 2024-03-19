const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent("Giải thích marketing là gì?");
  const response = await result.response;

  console.log(response.text());
}

run();