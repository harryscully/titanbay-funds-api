import express from "express"

const PORT = 8000

const app = express()

app.use(express.json())
app.get("/health", (req,res) => {
    res.json({"status" : "ok"})
})

app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
