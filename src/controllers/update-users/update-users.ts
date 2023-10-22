import { User } from "@/models/user"
import { HttpRequest, HttpResponse } from "../protocols"
import {
  IUpdateUserController,
  IUpdateUserRepository,
  UpdateUserParams,
} from "./protocols"

export class UpdateUserController implements IUpdateUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<User>> {
    try {
      const id = httpRequest.params.id
      const body = httpRequest?.body as UpdateUserParams

      if (!id) {
        return {
          statusCode: 400,
          body: "Missing user id",
        }
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
        return {
          statusCode: 400,
          body: "Some received field is not allowed",
        }
      }
      const user = await this.updateUserRepository.updateUser(id, body)
      return {
        statusCode: 200,
        body: user,
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: "something went wrong",
      }
    }
  }
}
