import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(4,'Min length should be atleast 4 character').max(60,'Max allowed length is 60 character'),
  password: z.string().min(4,'Min length should be atleast 4 character').max(20,'Max allowed length is 20 character'),
});
