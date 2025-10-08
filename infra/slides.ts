import { domain } from "./dns";
import { realtime } from "./realtime";
import { realtimeReadOnlyToken, realtimeWriteToken } from "./secrets";

export const slides = new sst.aws.StaticSite("Slides", {
  domain: {
    name: `slides.${domain}`,
    dns: sst.cloudflare.dns(),
  },
  build: {
    command: "bun run build",
    output: "dist",
  },
  dev: {
    command: "bun dev",
  },
  path: "packages/slides",
  environment: {
    VITE_DOMAIN: domain,
    VITE_IOT_TOKEN: realtimeReadOnlyToken.value,
    VITE_IOT_ENDPOINT: realtime.endpoint,
    VITE_IOT_AUTHORIZER: realtime.authorizer,
    VITE_APP_NAME: $app.name,
    VITE_STAGE: $app.stage,
  },
});
