import { z } from "zod";

export const getEventById = z.object({
  id: z.string().describe("The id of the event"),
});
