// Message validator to parse messages in valid way
import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
