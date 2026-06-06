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

fundsRouter.get('/', async (req, res) => {
    const funds = await prisma.fund.findMany()
    const fundsFormatted = funds.map(formatFund)
    res.json(fundsFormatted)
})

fundsRouter.post('/', async (req, res) => {
    const newFund = await prisma.fund.create({
        data: { ...req.body }
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
        const { id, ...data } = req.body
        const updatedFund = await prisma.fund.update({
            where: { id: id },
            data
        })
        res.json(formatFund(updatedFund))
    } catch (err) {
        res.status(404).json({ "error": "fund not found" })
    }
})