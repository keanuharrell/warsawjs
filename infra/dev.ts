export const _ = new sst.x.DevCommand("EmailDevCommand", {
  dev: {
    autostart: true,
    directory: "packages/email",
    command: "bun dev",
  },
});
