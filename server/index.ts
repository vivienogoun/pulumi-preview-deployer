import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// GitHub webhook listener
app.post("/webhook", (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log(`Received GitHub event: ${event}`);
  console.log(payload);

  res.status(200).send("Webhook received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server running on http://localhost:${PORT}`);
});
