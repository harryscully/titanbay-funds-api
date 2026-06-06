import express from "express"
import { prisma } from "../lib/prisma"
import type { Investor } from "../generated/prisma/client"

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