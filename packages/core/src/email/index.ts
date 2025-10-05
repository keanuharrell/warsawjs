import { EmailService } from "./service";
import { getEmailConfig } from "./config";

// Export types for external use
export type { EmailTemplate, EmailSender, EmailConfig } from "./types";

// Export service and senders for advanced usage
export { EmailService } from "./service";
export { SESSender, createEmailSender } from "./senders";
export { emailTemplates } from "./templates";
export { emailConfigs, getEmailConfig } from "./config";

// Singleton instance with environment-based config
export const emailService = new EmailService(getEmailConfig());
