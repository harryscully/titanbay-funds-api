import express from "express"
import { prisma } from "../lib/prisma"

export const fundsRouter = express.Router()

fundsRouter.get('/', async (req,res) => {
    res.json(await prisma.fund.findMany())
})