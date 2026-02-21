import { z } from "zod";
export const getCalendarSchema = z.object({
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
});
export type GetCalendarDTO = z.infer<typeof getCalendarSchema>;
