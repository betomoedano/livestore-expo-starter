import { makeDurableObject, makeWorker } from "@livestore/sync-cf/cf-worker";
import * as jose from "jose";

const JWT_SECRET = "a-string-secret-at-least-256-bits-long";

export class SyncBackend extends makeDurableObject({
  onPush: async (message) => {
    console.log("onPush", message.batch);
  },
  onPull: async (message) => {
    console.log("onPull", message);
  },
}) {}

export default makeWorker({
  validatePayload: async (payload: any) => {
    const { authToken } = payload;

    if (!authToken) {
      console.log("no auth token provided");
      throw new Error("No auth token provided");
    }

    const user = await getUserFromToken(authToken);

    if (!user) {
      throw new Error("Invalid auth token");
    } else {
      console.log("Sync backend payload", JSON.stringify(user, null, 2));
    }

    // TODO: check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.log("Token expired");
      throw new Error("Token expired");
    }
  },
  enableCORS: true,
});

async function getUserFromToken(
  token: string
): Promise<jose.JWTPayload | undefined> {
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch (error) {
    console.log("⚠️ Error verifying token", error);
  }
}
