import { dynamo } from "./database";
import { domain } from "./dns";
import { email } from "./email";

export const auth = new sst.aws.Auth("Auth", {
  domain: {
    name: `auth.${domain}`,
    dns: sst.cloudflare.dns(),
  },
  issuer: {
    architecture: "arm64",
    memory: "512 MB",
    timeout: "10 seconds",
    link: [dynamo, email],
    handler: "packages/functions/src/auth/index.handler",
    runtime: "nodejs22.x",
  },
  forceUpgrade: "v2",
});
