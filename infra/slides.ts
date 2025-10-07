import { domain } from "./dns";

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
    PUBLIC_DOMAIN: domain,
  }
});
