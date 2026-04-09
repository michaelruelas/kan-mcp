import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KanClient } from "./client.js";
import { toMcpError } from "./errors.js";

const apiKey = process.env.KAN_API_KEY;
if (!apiKey) {
  console.error("KAN_API_KEY environment variable is required");
  process.exit(1);
}

const client = new KanClient(apiKey);

const server = new Server(
  { name: "kan-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Server error:", toMcpError(error).message);
  process.exit(1);
});
