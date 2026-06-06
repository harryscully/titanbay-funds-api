import "dotenv/config"
import express from "express"
import { fundsRouter } from "./routes/funds"
const PORT = 8000

const app = express()

app.use(express.json())

app.get("/health", (req,res) => {
    res.json({"status" : "ok"})
})

app.use('/funds',fundsRouter)

app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
