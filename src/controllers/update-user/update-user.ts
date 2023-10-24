import { User } from "@/models/user"
import { HttpRequest, HttpResponse, IController } from "../protocols"
import { IUpdateUserRepository, UpdateUserParams } from "./protocols"
import { badRequest, serverError, success } from "../helpers"

export class UpdateUserController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateUserParams>,
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest.params.id
      const body = httpRequest?.body

      if (!body) {
        return badRequest("Missing fields")
      }

      if (!id) {
        return badRequest("Missing user id")
      }

      const allowedFields: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "password",
      ]
      const someFIeldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFields.includes(key as keyof UpdateUserParams),
      )

      if (someFIeldIsNotAllowedToUpdate) {
        return badRequest("Some received field is not allowed")
      }
      const user = await this.updateUserRepository.updateUser(id, body)
      return success<User>(user)
    } catch (error) {
      return serverError()
    }
  }
}
