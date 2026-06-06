import * as z from "zod"

export const createFundSchema = z.object({
    name: z.string().min(1),
    vintage_year: z.int(),
    target_size_usd: z.number().positive(),
    status: z.enum(["Fundraising", "Investing", "Closed"])
})

export const updateFundSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),
    vintage_year: z.int(),
    target_size_usd: z.number().positive(),
    status: z.enum(["Fundraising", "Investing", "Closed"])
})