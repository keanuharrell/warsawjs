import { auth } from "./auth";
import { realtimeAuthorizerToken } from "./secrets";

export const realtime = new sst.aws.Realtime("Realtime", {
  authorizer: {
    name: "RealtimeAuthorizer", // Explicit name for the authorizer
    architecture: "arm64",
    memory: "128 MB",
    timeout: "10 seconds",
    link: [realtimeAuthorizerToken, auth],
    handler: "packages/functions/src/realtime/authorizer.handler",
  },
})
