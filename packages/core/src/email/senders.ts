import { EmailSender, EmailTemplate, EmailConfig } from "./types";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// SES sender for production (placeholder)
export class SESSender implements EmailSender {
  constructor(
    private config: EmailConfig,
    private sesClient = new SESClient(),
  ) {}

  async send(to: string, template: EmailTemplate): Promise<void> {
    await this.sesClient.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: template.html,
            },
            ...(template.text && {
              Text: {
                Charset: "UTF-8",
                Data: template.text,
              },
            }),
          },
          Subject: {
            Charset: "UTF-8",
            Data: template.subject,
          },
        },
        Source: this.config.from,
        ...(this.config.replyTo && {
          ReplyToAddresses: [this.config.replyTo],
        }),
      }),
    );
  }
}

// Factory to create email sender
export function createEmailSender(config: EmailConfig): EmailSender {
  switch (config.provider) {
    case "ses":
      return new SESSender(config);
    default:
      throw new Error(`Unknown email provider: ${config.provider}`);
  }
}
