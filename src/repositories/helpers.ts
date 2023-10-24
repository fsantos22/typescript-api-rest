import { User } from "@/models/user"
import { MongoUser } from "./mongo-protocols"
import { WithId } from "mongodb"

export const replaceMongoId = (user: WithId<MongoUser>): User => {
    const { _id, ...rest } = user
    return { id: _id.toHexString(), ...rest }
}