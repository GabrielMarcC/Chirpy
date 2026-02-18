import { Request, Response } from "express"
import { deleteAllUsers } from "../db/queries/users.js"

export async function handlerReset(req: Request, res: Response) {
  await deleteAllUsers()

  res.status(200).send()
}
