import { EmailSender, EmailConfig } from "./types";
import { emailTemplates } from "./templates";
import { createEmailSender } from "./senders";

// Email service class
export class EmailService {
  private sender: EmailSender;

  constructor(config: EmailConfig) {
    this.sender = createEmailSender(config);
  }

  // Authentication emails
  async sendAuthCode(email: string, code: string): Promise<void> {
    const template = await emailTemplates.authCode(email, code);
    await this.sender.send(email, template);
  }

  // Welcome emails
  async sendWelcomeEmail(
    email: string,
    name: string,
    dashboardUrl: string,
  ): Promise<void> {
    const template = await emailTemplates.welcome(name, dashboardUrl);
    await this.sender.send(email, template);
  }

  // Demo-related emails
  async sendDemoStarted(
    email: string,
    sessionId: string,
    publicUrl: string,
    adminUrl: string,
    timestamp: string,
  ): Promise<void> {
    const template = await emailTemplates.demoStarted(sessionId, publicUrl, adminUrl, timestamp);
    await this.sender.send(email, template);
  }

  // Presentation recap email
  async sendPresentationRecap(
    email: string,
    presentationDate: string,
  ): Promise<void> {
    const template = await emailTemplates.presentationRecap(email, presentationDate);
    await this.sender.send(email, template);
  }

  // Generic send method (for custom HTML)
  async send(to: string, subject: string, html: string): Promise<void> {
    await this.sender.send(to, { subject, html });
  }

  // Method to replace sender (for production setup)
  setSender(sender: EmailSender): void {
    this.sender = sender;
  }

  // Method to update config
  updateConfig(config: EmailConfig): void {
    this.sender = createEmailSender(config);
  }
}
