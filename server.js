const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const GITHUB_TOKEN = "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";
const OWNER = "mahimakaushika";
const REPO = "Fund-Details";
const FILE_PATH = "data.json";

app.post("/save", async (req, res) => {
  try {
    const newData = req.body;

    // Get existing file
    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    const content = JSON.parse(
      Buffer.from(response.data.content, "base64").toString()
    );

    content.push(newData);

    const updatedContent = Buffer.from(
      JSON.stringify(content, null, 2)
    ).toString("base64");

    await axios.put(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        message: "Update data",
        content: updatedContent,
        sha: response.data.sha,
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    res.send("Saved!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/data", async (req, res) => {
  const response = await axios.get(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`
  );

  const content = JSON.parse(
    Buffer.from(response.data.content, "base64").toString()
  );

  res.json(content);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
