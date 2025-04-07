import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { LocalProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";

const app = express();
app.use(bodyParser.json());

// GitHub webhook listener
app.post("/webhook", async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log(`Received GitHub event: ${event}`);
  console.log(payload);

  if (event === "pull_request") {
    const action = payload.action;
    const prNumber = payload.number;

    try {
      if (
        action === "opened" ||
        action === "reopened" ||
        action === "synchronize"
      ) {
        await deployPreview(prNumber);
      } else if (action === "closed") {
        await destroyPreview(prNumber);
      }
    } catch (err) {
      console.error("❌ Error handling PR event:", err);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server running on http://localhost:${PORT}`);
});

async function deployPreview(prNumber: number) {
  const stackName = `pr-${prNumber}`;

  const workDir = path.join(__dirname, "..", "infra");

  const args: LocalProgramArgs = {
    stackName,
    workDir,
  };

  // Create or select a stack
  const stack = await LocalWorkspace.createOrSelectStack(args);

  console.log(`🛠️ Starting preview deploy for PR #${prNumber}...`);

  await stack.setConfig("aws:region", { value: "us-east-1" });

  await stack.refresh({ onOutput: console.info });

  await stack.up({ onOutput: console.log });

  const outputs = await stack.outputs();
  console.log(`🌐 Preview site URL: ${outputs.bucketEndpoint.value}`);
}

async function destroyPreview(prNumber: number) {
  const stackName = `pr-${prNumber}`;

  const workDir = path.join(__dirname, "..", "infra");

  const args: LocalProgramArgs = {
    stackName,
    workDir,
  };

  const stack = await LocalWorkspace.selectStack(args);

  console.log(`🧹 Destroying preview env for PR #${prNumber}...`);

  await stack.destroy({ onOutput: console.log });
  await stack.workspace.removeStack(stackName);

  console.log(`✅ Preview env for PR #${prNumber} destroyed.`);
  console.log(`🗑️ Stack ${stackName} removed from workspace.`);
}
