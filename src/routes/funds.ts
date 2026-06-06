import express from "express"
import { prisma } from "../lib/prisma"
import type { Fund } from "../generated/prisma/client"

export const fundsRouter = express.Router()

function formatFund(fund: Fund) {
    return {
        ...fund,
        target_size_usd: Number(fund.target_size_usd)
    }
}

fundsRouter.get('/', async (req,res) => {
    const funds = await prisma.fund.findMany()
    const fundsFormatted = funds.map(formatFund)
    res.json(fundsFormatted)
})

fundsRouter.post('/', async (req,res) => {
    const newFund = await prisma.fund.create({
        data: {...req.body}
    })
    const newFundFormatted = formatFund(newFund)
    res.status(201)
        .json(newFundFormatted)
})