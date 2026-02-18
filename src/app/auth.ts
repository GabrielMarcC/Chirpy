import * as argon2 from "argon2"
import { Request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { UnauthorizedError } from "./errors.js"
import { randomBytes } from "node:crypto"

export const hashPassword = async (password: string) => {
  const hash = argon2.hash(password)
  return hash
}

export const checkPasswordHash = async (password: string, hash: string) => {
  const isValid = await argon2.verify(hash, password)

  return isValid
}

export const makeJWT = (
  userID: string,
  expiresIn: number,
  secret: string
): string => {
  const createdAt = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      iss: "chirpy",
      sub: userID,
      iat: createdAt,
      exp: createdAt + expiresIn,
    },
    secret
  )
}

export const validateJWT = (tokenString: string, secret: string) => {
  try {
    const decoded = jwt.verify(tokenString, secret) as JwtPayload

    if (!decoded.sub) throw new Error("invalid token")

    return decoded.sub as string
  } catch {
    throw new UnauthorizedError("invalid token")
  }
}

export const getBearerToken = (req: Request) => {
  const authHeader = req.get("authorization")

  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is missing")
  }

  const parts = authHeader.trim().split(" ")

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    throw new UnauthorizedError("Invalid Bearer token")
  }

  return parts[1]
}

export const makeRefreshToken = () => {
  const token = randomBytes(256)

  return token.toString("hex")
}

export const getAPIKey = (req: Request) => {
  const header = req.get("authorization")

  if (!header) {
    throw new UnauthorizedError("Authorization header is missing")
  }

  const parts = header.trim().split(" ")

  if (!parts[0].length || parts[0] !== "ApiKey" || !parts[1]) {
    throw new UnauthorizedError("Invalid API KEY")
  }

  return parts[1]
}
