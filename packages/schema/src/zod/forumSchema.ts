import { z } from "zod";

export const getMessagesForCategorySchema = z.object({
  category: z.string().describe("The category to get messages for"),
  cursor: z
    .string()
    .optional()
    .nullish()
    .describe("The cursor (a message id) to start from"),
});

export const createNewMessageForCategorySchema = z.object({
  category: z
    .string()
    .describe("The category to post in. Must be a valid category id"),
  message: z.string().min(1).describe("The message to post"),
});
