import { User } from "@/models/user"
import { HttpRequest, HttpResponse, IController } from "../protocols"
import { IDeleteUserRepository } from "./protocols"
import { badRequest, serverError, success } from "../helpers"

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(
    httpRequest: HttpRequest<any>,
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id

      if (!id) {
        return badRequest("Missing user id")
      }

      const user = await this.deleteUserRepository.deleteUser(id)

      return success<User>(user)
    } catch (error) {
      return serverError()
    }
  }
}
