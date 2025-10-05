import { render } from "@react-email/render";
import { AuthCode, Welcome, RoomInvite, SessionSummary } from "@askmyroom/email";
import { EmailTemplate } from "./types";

// Email template rendering functions
export const emailTemplates = {
  authCode: async (email: string, code: string): Promise<EmailTemplate> => ({
    subject: "Your AskMyRoom login code",
    html: await render(AuthCode({ email, code })),
  }),

  welcome: async (
    name: string,
    dashboardUrl: string,
  ): Promise<EmailTemplate> => ({
    subject: "Welcome to AskMyRoom!",
    html: await render(Welcome({ name, dashboardUrl })),
  }),

  roomInvite: async (
    roomTitle: string,
    joinCode: string,
    joinUrl: string,
    hostName: string,
  ): Promise<EmailTemplate> => ({
    subject: `You're invited to join: ${roomTitle}`,
    html: await render(
      RoomInvite({
        roomTitle,
        joinCode,
        joinUrl,
        hostName,
      }),
    ),
  }),

  sessionSummary: async (
    hostName: string,
    roomTitle: string,
    duration: string,
    totalParticipants: number,
    totalQuestions: number,
    totalPollResponses: number,
    averageFeedback?: number,
    topQuestions?: Array<{ text: string; votes: number }>,
  ): Promise<EmailTemplate> => ({
    subject: `Session summary: ${roomTitle}`,
    html: await render(
      SessionSummary({
        hostName,
        roomTitle,
        duration,
        totalParticipants,
        totalQuestions,
        totalPollResponses,
        averageFeedback,
        topQuestions,
      }),
    ),
  }),
};
