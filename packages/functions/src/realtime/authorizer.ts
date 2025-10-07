import { createRemoteJWKSet } from "jose";
import { Resource } from "sst";
import { realtime } from "sst/aws/realtime";

const JWKS = createRemoteJWKSet(new URL(`${Resource.Auth.url}/.well-known/jwks.json`));

export const handler = realtime.authorizer(async (token) => {
  const prefix = `${Resource.App.name}/${Resource.App.stage}`;

  // Validate token
  const isValid = token === Resource.RealtimeAuthorizerToken.value;

  console.log('[Authorizer] Connection attempt - Valid:', isValid);

  return isValid
    ? {
      publish: [`${prefix}/*`],
      subscribe: [`${prefix}/*`],
    }
    : {
      publish: [],
      subscribe: [],
    };
});
