import "dotenv/config"
import express from "express"
import type { Request, Response, NextFunction} from "express"
import { fundsRouter } from "./routes/funds"
import { investorsRouter } from "./routes/investors"

const PORT = 8000

const app = express()

app.use(express.json())

app.get("/health", (req, res) => {
    res.json({ "status": "ok" })
})

app.use('/funds', fundsRouter)
app.use('/investors', investorsRouter)

app.use((req, res) => {
    res.status(404).json({ "error": "route not found" })
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({"error" : "internal server error"})
})

app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
