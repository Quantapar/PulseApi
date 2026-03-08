import z from "zod";

export const endpointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  method: z.string().min(1).default("GET"),
  expectedStatus: z.number().int().positive().default(200),
  interval: z.number().int().positive().default(60),
});
