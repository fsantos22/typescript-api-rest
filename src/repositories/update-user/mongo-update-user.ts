import {
  IUpdateUserRepository,
  UpdateUserParams,
} from "@/controllers/update-user/protocols"
import { MongoClient } from "@/database/mongo"
import { User } from "@/models/user"
import { ObjectId } from "mongodb"
import { MongoUser } from "../mongo-protocols"
import { replaceMongoId } from "../helpers"

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(id: string, params: UpdateUserParams): Promise<User> {
    await MongoClient.db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { ...params },
      },
    )
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: new ObjectId(id) })

    if (!user) {
      throw new Error("user not updated")
    }

    return replaceMongoId(user)
  }
}
