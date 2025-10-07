import { render } from "@react-email/render";
import { AuthCode, Welcome } from "@askmyroom/email";
import { DemoStarted, PresentationRecap } from "@warsawjs/email";
import { EmailTemplate } from "./types";

// Email template rendering functions
export const emailTemplates = {
  authCode: async (email: string, code: string): Promise<EmailTemplate> => ({
    subject: "🔐 Your WarsawJS Admin Login Code",
    html: await render(AuthCode({ email, code })),
  }),

  welcome: async (
    name: string,
    dashboardUrl: string,
  ): Promise<EmailTemplate> => ({
    subject: "🎉 Welcome to WarsawJS Admin Panel",
    html: await render(Welcome({ name, dashboardUrl })),
  }),

  demoStarted: async (
    sessionId: string,
    publicUrl: string,
    adminUrl: string,
    timestamp: string,
  ): Promise<EmailTemplate> => ({
    subject: "🎉 WarsawJS Demo Session Started",
    html: await render(DemoStarted({ sessionId, publicUrl, adminUrl, timestamp })),
  }),

  presentationRecap: async (
    recipientEmail: string,
    presentationDate: string,
  ): Promise<EmailTemplate> => ({
    subject: "WarsawJS × SST - Presentation Recap & Resources",
    html: await render(PresentationRecap({ recipientEmail, presentationDate })),
  }),

};
