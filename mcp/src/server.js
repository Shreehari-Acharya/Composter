#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getLocalUser } from "../lib/auth.js";
import { createMcpServer } from "../lib/factory.js";
import 'dotenv/config'; // Loads your DATABASE_URL from .env

async function main() {
  try {
    // 1. AUTHENTICATE
    // This reads your ~/.config/composter/session.json
    const userId = await getLocalUser();
    
    // Log to stderr so it doesn't break the protocol
    console.error(`✅ Authenticated as user ID: ${userId}`);

    // 2. CREATE SERVER (Scoped to this user)
    // This injects the ID into every Prisma query
    const server = createMcpServer(userId);

    // 3. CONNECT Transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('🚀 Composter MCP server running on stdio');

  } catch (error) {
    console.error("❌ Fatal Error:", error.message);
    process.exit(1);
  }
}

main();