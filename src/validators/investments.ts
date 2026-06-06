import * as z from "zod"

export const createInvestmentSchema = z.object({
    investor_id: z.uuid(),
    amount_usd: z.number().positive(),
    investment_date: z.iso.date()
})