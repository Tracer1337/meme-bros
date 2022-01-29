import express from "express"
import config from "./config"
import { Subject, Trend } from "./trend"

const app = express()

app.use(express.json())

const trend = new Trend(10, 100)
const subjects: Record<string, Subject> = {}

app.put("/subjects/:id", (req, res) => {
    const { id } = req.params
    if (id in subjects) {
        return res.sendStatus(409)
    }
    subjects[id] = new Subject(id)
    trend.addSubject(subjects[id])
    res.end()
})

app.delete("/subjects/:id", (req, res) => {
    const { id } = req.params
    if (!(id in subjects)) {
        return res.sendStatus(404)
    }
    trend.removeSubject(subjects[id])
    delete subjects[id]
    res.end()
})

app.post("/hit/:id", (req, res) => {
    const { id } = req.params
    if (!(id in subjects)) {
        return res.sendStatus(404)
    }
    trend.hit(subjects[id])
    res.end()
})

app.get("/trend", (_req, res) => {
    res.send(trend.getTrendingSubjects().map((subject) => subject.id))
})

app.listen(config.port, () => {
    console.log("Server running on port", config.port)
})
