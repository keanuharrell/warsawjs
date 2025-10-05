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

  // Room-related emails
  async sendRoomInvite(
    recipientEmail: string,
    roomTitle: string,
    joinCode: string,
    joinUrl: string,
    hostName: string,
  ): Promise<void> {
    const template = await emailTemplates.roomInvite(
      roomTitle,
      joinCode,
      joinUrl,
      hostName,
    );
    await this.sender.send(recipientEmail, template);
  }

  async sendSessionSummary(
    recipientEmail: string,
    hostName: string,
    roomTitle: string,
    duration: string,
    stats: {
      totalParticipants: number;
      totalQuestions: number;
      totalPollResponses: number;
      averageFeedback?: number;
      topQuestions?: Array<{ text: string; votes: number }>;
    }
  ): Promise<void> {
    const template = await emailTemplates.sessionSummary(
      hostName,
      roomTitle,
      duration,
      stats.totalParticipants,
      stats.totalQuestions,
      stats.totalPollResponses,
      stats.averageFeedback,
      stats.topQuestions,
    );
    await this.sender.send(recipientEmail, template);
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
