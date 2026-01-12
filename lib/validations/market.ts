import { z } from "zod";

export const createMarketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  endDate: z.coerce.date().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in future",
  }),
});
