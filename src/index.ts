import express from "express"
import { config } from "dotenv"
import { Request, Response } from "express"

config()

const app = express()

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!")
})
