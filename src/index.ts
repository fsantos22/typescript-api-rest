import express from "express"
import { config } from "dotenv"
import { Request, Response } from "express"
import { MongoGetUsersRepository } from "./repositories/get-users/mongo-get-users"
import { GetUsersController } from "./controllers/get-users/get-users"
import { MongoClient } from "./database/mongo"
import { MongoCreateUserRepository } from "./repositories/create-users/mongo-create-user"
import { CreateUserController } from "./controllers/create-users/create-users"
import { MongoUpdateUserRepository } from "./repositories/update-users/mongo-update-users"
import { UpdateUserController } from "./controllers/update-users/update-users"

const main = async () => {
  config()

  const app = express()

  app.use(express.json())

  await MongoClient.connect()

  app.get("/users", async (req: Request, res: Response) => {
    const mongoGetUsersRepository = new MongoGetUsersRepository()

    const getUsersController = new GetUsersController(mongoGetUsersRepository)

    const { body, statusCode } = await getUsersController.handle()

    res.status(statusCode).send(body)
  })

  app.post("/users", async (req: Request, res: Response) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository()

    const createUserController = new CreateUserController(
      mongoCreateUserRepository,
    )

    const { body, statusCode } = await createUserController.handle({
      body: req.body,
    })

    res.status(statusCode).send(body)
  })

  app.patch("/users/:id", async (req: Request, res: Response) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository()

    const updateUserController = new UpdateUserController(
      mongoUpdateUserRepository,
    )

    const { body, statusCode } = await updateUserController.handle({
      body: req.body,
      params: req.params,
    })

    res.status(statusCode).send(body)
  })

  const port = process.env.PORT || 3000

  app.listen(port, () => console.log(`listening on port ${port}`))
}

main()
