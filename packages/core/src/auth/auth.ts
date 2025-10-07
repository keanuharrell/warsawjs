import { issuer } from "@openauthjs/openauth";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { subjects } from "./subjects";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { DynamoStorage } from "@openauthjs/openauth/storage/dynamo";
import { Resource } from "sst";
import { UserDB } from "../dynamo/User";
import { randomUUID } from "crypto";
import { emailService } from "../email/index";

// Fonction pour récupérer ou créer un utilisateur
export async function getOrCreateUser(
  email: string,
  name?: string,
) {
  try {
    // Essayer de récupérer l'utilisateur par email
    const existingUser = await UserDB.getByEmail(email);

    if (existingUser) {
      return existingUser.userId;
    }

    // Créer un nouvel utilisateur
    const userId = randomUUID();
    const displayName = name || email.split("@")[0];

    const newUser = await UserDB.create({
      userId,
      email,
      displayName,
    });

    // Envoyer email de bienvenue pour nouveaux utilisateurs
    try {
      await emailService.sendWelcomeEmail(
        email,
        displayName,
        "https://askmyroom.dev/dashboard" // TODO: Use actual dashboard URL from env
      );
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Ne pas faire échouer l'auth si l'email échoue
    }

    return newUser.data.userId;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw error;
  }
}


export const auth = issuer({
  subjects,
  storage: DynamoStorage({
    table: Resource.Dynamo.name,
    pk: "pk",
    sk: "sk",
  }),
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (claims, code) => {
          // Restrict access to admin only
          const allowedEmail = "keanuharrell@icloud.com";

          if (claims.email !== allowedEmail) {
            throw new Error("Access denied. Only authorized users can access this application.");
          }

          await emailService.sendAuthCode(claims.email, code);
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    const userId = await getOrCreateUser(
      value.claims.email,
      value.claims.name,
    );

    return ctx.subject("user", {
      userID: userId,
      email: value.claims.email,
      name: value.claims.name || value.claims.email.split("@")[0],
    });
  },
});
