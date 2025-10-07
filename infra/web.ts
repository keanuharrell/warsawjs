import { auth } from "./auth";
import { dynamo } from "./database";
import { domain } from "./dns";
import { email } from "./email";
import { realtime } from "./realtime";
import { realtimeAuthorizerToken } from "./secrets";

export const admin = new sst.aws.Nextjs("Admin", {
  path: "packages/admin",
  domain: {
    name: `admin.${domain}`,
    dns: sst.cloudflare.dns(),
  },
  link: [auth, email, dynamo, realtime, realtimeAuthorizerToken],
  dev: {
    command: "bun dev",
  },
  server: {
    memory: "256 MB",
    timeout: "30 seconds",
    architecture: "arm64",
    runtime: "nodejs22.x",
  }
});

export const web = new sst.aws.Nextjs("Web", {
  path: "packages/web",
  domain: {
    name: domain,
    dns: sst.cloudflare.dns(),
  },
  link: [email, dynamo, realtime, realtimeAuthorizerToken],
  dev: {
    command: "bun dev",
  },
  server: {
    memory: "256 MB",
    timeout: "30 seconds",
    architecture: "arm64",
    runtime: "nodejs22.x",
  }
});
