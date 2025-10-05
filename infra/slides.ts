import { domain } from "./dns";

export const slides = new sst.aws.StaticSite("Slides", {
    domain: {
        name: `slides.${domain}`,
        dns: sst.cloudflare.dns(),
    },
    dev: {
        command: "bun dev",
    },
    path: "packages/slides",
});
