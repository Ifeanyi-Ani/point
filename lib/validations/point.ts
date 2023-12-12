import * as z from "zod";

export const PointValidation = z.object({
  point: z.string().min(3, { message: "minimum 3 characters." }),
  accountId: z.string(),
});
export const CommentValidation = z.object({
  point: z.string().min(3, { message: "minimum 3 characters" }),
});
