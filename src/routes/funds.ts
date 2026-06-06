import express from "express"
import { prisma } from "../lib/prisma"

export const fundsRouter = express.Router()

fundsRouter.get('/', async (req,res) => {
    res.json(await prisma.fund.findMany())
})

fundsRouter.post('/', async (req,res) => {
    const newFund = await prisma.fund.create({
        data: {...req.body}
    })
    res.status(201)
        .json(newFund)
})