/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "warsawjs",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
      region: "eu-west-3",
      providers: {
        aws: {
          profile: "sst",
        },
        cloudflare: "6.9.1",
      },
    };
  },
  async run() {
    await import("./infra/database");
    await import("./infra/email");
    await import("./infra/dev");
    await import("./infra/slides");
    await import("./infra/web");

  },
});
