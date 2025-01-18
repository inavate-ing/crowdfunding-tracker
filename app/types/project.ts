import { z } from 'zod';

export const projectSchema = z.object({
    's.no': z.number(),
    'amt.pledged': z.number(),
    blurb: z.string(),
    by: z.string(),
    country: z.string(),
    currency: z.string(),
    'end.time': z.string(),
    location: z.string(),
    'percentage.funded': z.number(),
    'num.backers': z.string(),
    state: z.string(),
    title: z.string(),
    type: z.string(),
    url: z.string(),
});

export const projectsArraySchema = z.array(projectSchema);

export type Project = z.infer<typeof projectSchema>;
