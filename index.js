const express = require("express");
const axios = require("axios");
const cors = require("cors");
const User = require("./config");
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
const currentTime = new Date();
const endpoint =
  "https://us-central1-chat-for-chatgpt.cloudfunctions.net/basicUserRequestBeta";

// function sendResponse(res, status, message) {
//   res.setHeader("Content-Type", "application/json");
//   res.status(status).send(JSON.stringify({ status, message }, null, 2));
// }
const conversation = [];
app.post("/", async (req, res) => {
  const textMessage = req.body.text;
  try {
    const response = await axios.post(
      endpoint,
      {
        data: {
          message: textMessage,
        },
      },
      {
        headers: {
          Host: "us-central1-chat-for-chatgpt.cloudfunctions.net",
          Connection: "keep-alive",
          Accept: "*/*",
          "User-Agent": "com.tappz.aichat/1.2.2 iPhone/16.3.1 hw/iPhone12_5",
          "Accept-Language": "en",
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );

    const result = response.data.result.choices[0].text;
    const dbResult = await User.add({
      user: textMessage,
      bot: result,
      time: currentTime,
    });
    conversation.push({ user: textMessage, bot: result });
    res.status(200).send(result);
  } catch (error) {
    res.status(403).send("Error connecting to OpenAI");
  }
});
app.get("/conversation", (req, res) => {
  try {
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error retrieving conversation:", error);
    res.status(500).send("Error retrieving conversation");
  }
});
app.post("/post", async (req, res) => {
  try {
    const data = req.body;

    // Save the data to Firebase
    const result = await User.add({ conversation });
    // Send a success response to the client
    res.status(200).send(`Post created with ID: ${result.id}`);
  } catch (error) {
    // Handle errors and send an error response to the client
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running at Port:${port}`);
});
