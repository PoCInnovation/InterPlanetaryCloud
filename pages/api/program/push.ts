// These are the dependencies for this file.
//
// You installed the `dotenv` and `octokit` modules earlier. The `@octokit/webhooks` is a dependency of the `octokit` module, so you don't need to install it separately. The `fs` and `http` dependencies are built-in Node.js modules.
import * as dotenv from "dotenv";
import { Octokit, App } from 'octokit';
import { createNodeMiddleware } from "@octokit/webhooks";
import { Server as WebSocketServer } from 'ws';
import * as fs from "fs";
import * as http from "http";
import * as stream from "stream";
import * as util from "util";
// This reads your `.env` file and adds the variables from that file to the `process.env` object in Node.js.
dotenv.config();


// This assigns the values of your environment variables to local variables.
const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;


// This reads the contents of your private key file.
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// This creates a new instance of the Octokit App class.
const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  },
});


// This adds an event handler that your code will call later. When this event handler is called, it will log the event to the console. Then, it will use GitHub's REST API to add a comment to the pull request that triggered the event.
const handlePush = async ({ octokit, payload }) => {
  try {
    console.log(payload)
    console.log("NAME\n", payload.repository.owner.name);
    console.log("REPO\n", payload.repository.name);
    console.log("REF\n", payload.ref);
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
      request: {
        parseSuccessResponseBody: false
      },
      owner: payload.repository.owner.name,
      repo: payload.repository.name,
      ref: payload.ref
    })
    // console.log(response)
    const pipeline = util.promisify(stream.pipeline);
    
    // Create a write stream to save the data to the "repo.zip" file
    const writeStream = fs.createWriteStream(`${payload.repository.name}.zip`);
    
    // Pipe the ReadableStream to the write stream using pipeline
    await pipeline(response.data, writeStream);
    console.log(`Repository ZIP archive downloaded and saved as ${payload.repository.name}.zip`);
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
};

// This sets up a webhook event listener. When your app receives a webhook event from GitHub with a `X-GitHub-Event` header value of `pull_request` and an `action` payload value of `opened`, it calls the `handlePullRequestOpened` event handler that is defined above.
app.webhooks.on("push", handlePush);

// This logs any errors that occur.
app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

// This determines where your server will listen.
//
// For local development, your server will listen to port 3000 on `localhost`. When you deploy your app, you will change these values. For more information, see "[Deploy your app](#deploy-your-app)."
const port = 3030;
const host = 'localhost';
const path = "/api/webhook";
const localWebhookUrl = `http://${host}:${port}${path}`;

// This sets up a middleware function to handle incoming webhook events.
//
// Octokit's `createNodeMiddleware` function takes care of generating this middleware function for you. The resulting middleware function will:
//
//    - Check the signature of the incoming webhook event to make sure that it matches your webhook secret. This verifies that the incoming webhook event is a valid GitHub event.
//    - Parse the webhook event payload and identify the type of event.
//    - Trigger the corresponding webhook event handler.
const middleware = createNodeMiddleware(app.webhooks, { path });

// This creates a Node.js server that listens for incoming HTTP requests (including webhook payloads from GitHub) on the specified port. When the server receives a request, it executes the `middleware` function that you defined earlier. Once the server is running, it logs messages to the console to indicate that it is listening.
const server = http.createServer(async (req, res) => {
  // `middleware` returns `false` when `req` is unhandled (beyond `/webhooks`)
  if (await middleware(req, res)) { return };
  res.writeHead(404);
  res.end();
})

server.listen(3030);