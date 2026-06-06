import "dotenv/config"
import express from "express"
import { fundsRouter } from "./routes/funds"
import { investorsRouter } from "./routes/investors"

const PORT = 8000

const app = express()

app.use(express.json())

app.get("/health", (req,res) => {
    res.json({"status" : "ok"})
})

app.use('/funds',fundsRouter)
app.use('/investors',investorsRouter)

app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
