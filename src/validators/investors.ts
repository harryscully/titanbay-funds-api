import * as z from "zod"

export const createInvestorSchema = z.object({
    name: z.string().min(1),
    investor_type: z.enum(["Individual", "Institution", "Family Office"])
                        .transform(val => val === "Family Office" ? "FamilyOffice" : val),
    email: z.email(),
})