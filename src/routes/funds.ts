import express from "express"
import { prisma } from "../lib/prisma"
import type { Fund, Investment } from "../generated/prisma/client"
import { createFundSchema, updateFundSchema } from "../validators/funds"
import { createInvestmentSchema } from "../validators/investments"
import * as z from "zod"

export const fundsRouter = express.Router()

function formatFund(fund: Fund) {
    return {
        ...fund,
        target_size_usd: Number(fund.target_size_usd)
    }
}

function formatInvestment(investment: Investment) {
    return {
        ...investment,
        amount_usd: Number(investment.amount_usd),
        investment_date: investment.investment_date.toISOString().split("T")[0]
    }
}

fundsRouter.get('/', async (req, res) => {
    const funds = await prisma.fund.findMany()
    const fundsFormatted = funds.map(formatFund)
    res.json(fundsFormatted)
})

fundsRouter.post('/', async (req, res) => {
    const result = createFundSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({"error": z.prettifyError(result.error)})
        return
    }
    const newFund = await prisma.fund.create({
        data: result.data
    })
    const newFundFormatted = formatFund(newFund)
    res.status(201)
        .json(newFundFormatted)
})

fundsRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    const fund = await prisma.fund.findUnique({
        where: { id: id }
    })
    if (!fund) {
        res.status(404).json({ "error": `no fund found with id: ${id}` })
    } else {
        res.json(formatFund(fund))
    }
})

fundsRouter.put('/', async (req, res) => {
    try {
        const result = updateFundSchema.safeParse(req.body)
        if (!result.success) {
            res.status(400).json({"error": z.prettifyError(result.error)})
            return
        }
        const { id, ...data } = result.data
        const updatedFund = await prisma.fund.update({
            where: { id: id },
            data
        })
        res.json(formatFund(updatedFund))
    } catch (err) {
        res.status(404).json({ "error": "fund not found" })
    }
})

fundsRouter.get('/:fund_id/investments', async (req, res) => {
    const fund = await prisma.fund.findUnique({
        where: { id: req.params.fund_id }
    })

    if (!fund) {
        res.status(404).json({ "error": "fund not found" })
    } else {
        const investments = await prisma.investment.findMany({
            where: { fund_id: req.params.fund_id }
        })
        res.json(investments.map(formatInvestment))
    }
})

fundsRouter.post('/:fund_id/investments', async (req, res) => {
    const fund = await prisma.fund.findUnique({
        where: { id: req.params.fund_id }
    })

    if (!fund) {
        res.status(404).json({ "error": "fund not found" })
    } else {
        const result = createInvestmentSchema.safeParse(req.body)
        if (!result.success) {
            res.status(400).json({"error": z.prettifyError(result.error)})
            return
        }

        const newInvestment = await prisma.investment.create({
            data: {
                ...result.data,
                fund_id: req.params.fund_id,
                investment_date: result.data.investment_date
            }
        })
        res.status(201).json(formatInvestment(newInvestment))
    }
})