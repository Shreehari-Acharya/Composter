// mcp/lib/auth.js
import fs from "fs";
import path from "path";
import os from "os";
import { createRemoteJWKSet, jwtVerify } from "jose";

const SESSION_PATH = path.join(os.homedir(), ".config", "composter", "session.json");


const JWKS_URL = new URL("http://localhost:3000/api/auth/jwks");
const JWKS = createRemoteJWKSet(JWKS_URL);

/**
 * Reads the local CLI session, verifies the JWT, and returns the User ID.
 */
export async function getLocalUser() {
  // A. Check if file exists
  if (!fs.existsSync(SESSION_PATH)) {
    throw new Error("No session found. Please run 'composter login' in your terminal.");
  }

  // B. Read and Parse
  let sessionData;
  try {
    const raw = fs.readFileSync(SESSION_PATH, "utf-8");
    sessionData = JSON.parse(raw);
  } catch (err) {
    throw new Error("Corrupt session file. Please run 'composter login' again.");
  }

  // Check for the token field (adjust 'jwt' if your CLI saves it as 'token' or 'accessToken')
  const token = sessionData.jwt || sessionData.token || sessionData.accessToken;

  if (!token) {
    throw new Error("Session file missing token. Please login again.");
  }

  // C. Verify validity and expiration using JOSE
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "http://localhost:3000",
      audience: "http://localhost:3000",
    });

    // Better Auth puts the User ID in 'sub'
    return payload.sub;

  } catch (err) {
    if (err.code === "ERR_JWT_EXPIRED") {
      throw new Error("Session expired. Please run 'composter login' to refresh.");
    }
    // If the server is down, JWKS might fail
    if (err.code === "ECONNREFUSED") {
      throw new Error("Cannot contact backend to verify token. Is your server running on localhost:3000?");
    }
    throw new Error("Authentication failed: " + err.message);
  }
}