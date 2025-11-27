#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getLocalUser } from "../lib/auth.js";
import { createMcpServer } from "../lib/factory.js"; // <--- Missing import added here


async function main() {
  try {
    // 1. Authenticate (Read CLI session)
    const userId = await getLocalUser();
    
    // Log to stderr so it doesn't break the protocol
    console.error(`✅ Authenticated as user ID: ${userId}`);
    // 2. Create MCP Server for that User ID
    const server = createMcpServer(userId);

    // 3. Connect Transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('Composter MCP server running on stdio');

  } catch (error) {
    console.error("Fatal Error:", error.message);
    process.exit(1);
  }
}

main();