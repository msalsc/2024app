import { z } from "zod";

export const forgetPasswordForEmailSchema = z.object({
  email: z
    .string()
    .email()
    .describe("The email to send the reset password link to"),
});

export const createFavoriteForUserSchema = z.object({
  eventId: z.string().describe("The id of the event to favorite"),
});

export const signInWithEmailSchema = z.object({
  email: z.string().email().describe("The email to sign in with"),
  password: z.string().describe("The password to sign in with"),
});

export const createUserSchema = z.object({
  email: z.string().email().describe("The email to sign in with"),
  password: z.string().describe("The password to sign in with"),
  birthday: z.string().nullish(),
  name: z.string().describe("The name of the user").nullish(),
  gender: z.string().nullish(),
});

export const resetPasswordWithTokenSchema = z.object({
  token: z.string().uuid().describe("The token to reset the password with"),
  password: z.string().min(8).describe("The new password to set"),
});

export const addNotifcationInput = z.object({
  platform: z
    .enum(["ios", "android"])
    .describe("The platform to create the notication token for"),
  token: z
    .string()
    .describe("The device token to create the notication token for"),
});

export const sendUserUpdateSchema = z.object({
  description: z
    .string()
    .min(1)
    .describe("The description of the notification"),
  event_id: z.string().optional().describe("The event id for the notification"),
  name: z
    .string()
    .min(1)
    .describe(
      "The name of the category for the notification (not shown in notification). This is shown above the description in app."
    ),
  shouldSendNotication: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Whether to send a notication to the user, or just put the update in the app."
    ),
});
