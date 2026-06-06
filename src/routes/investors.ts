import express from "express"
import { prisma } from "../lib/prisma"
import type { Investor } from "../generated/prisma/client"
import { createInvestorSchema } from "../validators/investors"
import * as z from "zod"

export const investorsRouter = express.Router()

function formatInvestor(investor: Investor) {
    return {
        ...investor,
        investor_type: investor.investor_type === "FamilyOffice" ? "Family Office" : investor.investor_type
    }
}

investorsRouter.get('/', async (req, res) => {
    const investors = await prisma.investor.findMany()
    res.json(investors.map(formatInvestor))
})

investorsRouter.post('/', async (req, res) => {
    const result = createInvestorSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({"error": z.prettifyError(result.error)})
        return
    }
    const newInvestor = await prisma.investor.create({
        data: result.data
    })
    res.status(201)
        .json(formatInvestor(newInvestor))
})