import * as dotenv from "dotenv";
import { App } from 'octokit';
import { createNodeMiddleware } from "@octokit/webhooks";
import * as fs from "fs";
import * as http from "http";
import * as stream from "stream";
import * as util from "util";

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const app = new App({
  appId,
  privateKey,
  webhooks: {
    webhookSecret
  },
});


const handlePush = async ({ octokit, payload }) => {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
      request: {
        parseSuccessResponseBody: false
      },
      owner: payload.repository.owner.name,
      repo: payload.repository.name,
      ref: payload.ref
    })
    const pipeline = util.promisify(stream.pipeline);
    
    const writeStream = fs.createWriteStream(`${payload.repository.name}.zip`);
    
    await pipeline(response.data, writeStream);
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
};

app.webhooks.on("push", handlePush);

app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

const path = "/api/webhook";

const middleware = createNodeMiddleware(app.webhooks, { path });

const server = http.createServer(async (req, res) => {
  if (await middleware(req, res)) { return };
  res.writeHead(404);
  res.end();
})

server.listen(3030);