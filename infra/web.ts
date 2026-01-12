import { auth } from "./auth";
import { dynamo } from "./database";
import { domain } from "./dns";
import { email } from "./email";
import { realtime } from "./realtime";
import { realtimeWriteToken } from "./secrets";

export const admin = new sst.aws.Nextjs("Admin", {
  path: "packages/admin",
  domain: {
    name: `admin.${domain}`,
    dns: sst.cloudflare.dns(),
  },
  link: [auth, email, dynamo, realtime],
  dev: {
    command: "bun dev",
  },
  server: {
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
  link: [email, dynamo, realtime, realtimeWriteToken],
  dev: {
    command: "bun dev",
  },
  server: {
    architecture: "arm64",
    runtime: "nodejs22.x",
  }
});
