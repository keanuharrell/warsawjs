// Email template interface
export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// Email sender interface
export interface EmailSender {
  send(to: string, template: EmailTemplate): Promise<void>;
}

// Email configuration
export interface EmailConfig {
  from: string;
  replyTo?: string;
  provider: "ses";
}
