import { Request, Response } from "express"
import { findUserById, updateUser } from "../db/queries/users.js"
import { NotFoundError, UnauthorizedError } from "./errors.js"
import { getAPIKey } from "./auth.js"
import { config } from "../config.js"

export const handlerPolka = async (req: Request, res: Response) => {
  type Params = {
    event: string
    data: {
      userId: string
    }
  }

  const apiKey = getAPIKey(req)

  if (!apiKey) {
    throw new UnauthorizedError("Missing API KEY")
  }

  if (apiKey !== config.polka) {
    throw new UnauthorizedError("Invalid API KEY")
  }

  const params: Params = req.body
  const isUpgradedEvent = !!params.event.includes("user.upgraded")

  const user = await findUserById(params.data.userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  if (!isUpgradedEvent) {
    return res.status(204).send()
  }

  await updateUser({
    userId: user.id,
    isChirpyRed: true,
  })

  return res.status(204).send()
}
