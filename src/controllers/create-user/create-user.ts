import { User } from "@/models/user"
import { HttpRequest, HttpResponse, IController } from "../protocols"
import { CreateUserParams, ICreateUserRepository } from "./protocols"
import validator from "validator"
import { badRequest, created, serverError } from "../helpers"

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>,
  ): Promise<HttpResponse<User | string>> {
    const { body } = httpRequest
    try {
      const requiredFields = ["firstName", "lastName", "email", "password"]

      for (const field of requiredFields) {
        if (!body?.[field as keyof CreateUserParams]?.length) {
          return {
            statusCode: 400,
            body: `Field ${field} is required`,
          }
        }
      }

      const emailIsValid = validator.isEmail(body!.email)

      if (!emailIsValid) {
        return badRequest("E-mail is invalid")
      }

      if (!body) {
        return badRequest("Please, specify a body")
      }
      const user = await this.createUserRepository.createUser(body!)
      return created<User>(user)
    } catch (error) {
      return serverError()
    }
  }
}
