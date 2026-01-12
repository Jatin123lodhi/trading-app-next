import { z } from "zod";
export const createWalletSchema = z.object({
  balance: z.number().positive("Balance must be positive"),
  currency: z.enum(["INR", "USD"], { message: "Currency must be INR or USD" }), // how to add message
});
