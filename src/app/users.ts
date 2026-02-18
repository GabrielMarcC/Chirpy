import { Request, Response } from "express"
import { createUser, updateUser } from "../db/queries/users.js"
import { getBearerToken, hashPassword, validateJWT } from "./auth.js"
import { BadRequestError, UnauthorizedError } from "./errors.js"
import { config } from "../config.js"

type Params = {
  email: string
  password: string
}

export const handlerCreateUser = async (req: Request, res: Response) => {
  const params: Params = req.body

  const hash = await hashPassword(params.password)

  const newUser = await createUser({
    email: params.email,
    hashedPassword: hash,
  })

  res.status(201).send(Object(newUser))
}

export const handlerUpdateUser = async (req: Request, res: Response) => {
  const params: Params = req.body
  const token = getBearerToken(req)

  if (!token) {
    throw new UnauthorizedError("Missing token")
  }

  const userId = validateJWT(token, config.secret)

  if (!userId) {
    throw new UnauthorizedError("Invalid token")
  }

  const hash = await hashPassword(params.password)

  const user = await updateUser({
    userId,
    email: params.email,
    hashedPassword: hash,
  })

  if (!user) {
    throw new BadRequestError("Invalid password or email")
  }

  return res.status(200).send(Object(user))
}
