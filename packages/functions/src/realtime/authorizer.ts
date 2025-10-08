import { createRemoteJWKSet, jwtVerify } from "jose";
import { Resource } from "sst";
import { realtime } from "sst/aws/realtime";

const JWKS = createRemoteJWKSet(new URL(`${Resource.Auth.url}/.well-known/jwks.json`));

export const handler = realtime.authorizer(async (token) => {
  const prefix = `${Resource.App.name}/${Resource.App.stage}`;

  // Try to verify as JWT (admin token)
  try {
    await jwtVerify(token, JWKS);
    console.log('[Authorizer] Admin authenticated via JWT');
    // Admin: full access
    return {
      publish: [`${prefix}/*`],
      subscribe: [`${prefix}/*`],
    };
  } catch (jwtError) {
    // Not a valid JWT, continue with static token checks
  }

  // Check for write token (users who can participate)
  if (token === Resource.RealtimeWriteToken.value) {
    console.log('[Authorizer] Write access granted');
    // Write access: can publish to chat/vote, subscribe to everything
    return {
      publish: [`${prefix}/chat`, `${prefix}/vote`],
      subscribe: [`${prefix}/*`],
    };
  }

  // Check for read-only token (public access for slides/viewers)
  if (token === Resource.RealtimeReadOnlyToken.value) {
    console.log('[Authorizer] Read-only access granted');
    // Read-only: can subscribe to everything, but publish only to a dummy topic
    // AWS IoT Core MQTT requires at least one publish permission for connection stability
    return {
      publish: [`${prefix}/_readonly_dummy`],
      subscribe: [`${prefix}/*`],
    };
  }

  // No valid token
  console.log('[Authorizer] Access denied - invalid token');
  return {
    publish: [],
    subscribe: [],
  };
});
