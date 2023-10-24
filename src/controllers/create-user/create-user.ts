import { User } from "@/models/user"
import { HttpRequest, HttpResponse, IController } from "../protocols"
import {
  CreateUserParams,
  ICreateUserRepository,
} from "./protocols"
import validator from "validator"

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>,
  ): Promise<HttpResponse<User>> {
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
        return {
          statusCode: 400,
          body: "E-mail is missing",
        }
      }

      if (!body) {
        return {
          statusCode: 400,
          body: "Please, specify a body",
        }
      }
      const user = await this.createUserRepository.createUser(body!)
      return {
        statusCode: 201,
        body: user,
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong",
      }
    }
  }
}
