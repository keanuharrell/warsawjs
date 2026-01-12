/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "warsawjs",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
      region: "eu-central-1",
      providers: {
        aws: {
          profile: "sst",
        },
        cloudflare: "6.12.0",
      },
    };
  },
  async run() {
    await import("./infra/secrets");
    await import("./infra/database");
    await import("./infra/email");
    await import("./infra/auth");
    await import("./infra/realtime");
    await import("./infra/web");
    await import("./infra/slides");
    await import("./infra/dev");
  },
});
