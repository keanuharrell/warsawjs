import { Resource } from "sst";
import { EmailConfig } from "./types";

// Email configuration presets
export const emailConfigs = {
  default: {
    from: `noreply@${Resource.Email.sender}`,
    replyTo: `keanuharrell@icloud.com`,
    provider: "ses",
  } as EmailConfig,
};

// Get config based on environment
export function getEmailConfig(): EmailConfig {
  return emailConfigs.default;
}
