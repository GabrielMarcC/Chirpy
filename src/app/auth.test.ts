import { describe, it, expect } from "vitest"
import { Request } from "express"
import { makeJWT, validateJWT, getBearerToken, getAPIKey } from "./auth"
import { UnauthorizedError } from "./errors"

describe("JWT", () => {
  const secret = "super-secret"
  const otherSecret = "wrong-secret"
  const userID = "user-123"

  it("validate a recent token and return userID", () => {
    const token = makeJWT(userID, 60, secret)
    const id = validateJWT(token, secret)
    expect(id).toBe(userID)
  })

  it("reject token with wrong assignment", () => {
    const token = makeJWT(userID, 60, secret)
    expect(() => validateJWT(token, otherSecret)).toThrow(UnauthorizedError)
  })

  it("reject expired token", async () => {
    const token = makeJWT(userID, 1, secret)
    await new Promise((r) => setTimeout(r, 1100))
    expect(() => validateJWT(token, secret)).toThrow(UnauthorizedError)
  })

  it("verify if a token was provided in headers", () => {
    const req = {
      get: (header: string) => "Bearer user-123",
    } as unknown as Request
    const token = getBearerToken(req)
    expect(token).toBe("user-123")
  })

  it("fails if no header is present", () => {
    const req = {
      get: (_: string) => undefined,
    } as unknown as Request
    expect(() => getBearerToken(req)).toThrow("Authorization header is missing")
  })

  it("fails if format is wrong", () => {
    const req = {
      get: (name: string) => "Basic user-123",
    } as unknown as Request
    expect(() => getBearerToken(req)).toThrow("Invalid Bearer token")
  })

  it("verify if api keys exists on headers", () => {
    const req = {
      get: (_: string) => undefined,
    } as unknown as Request
    expect(() => getAPIKey(req)).toThrow("Authorization header is missing")
  })

  it("fails if format is wrong", () => {
    const req = {
      get: (name: string) => "Api Basic user-123",
    } as unknown as Request
    expect(() => getAPIKey(req)).toThrow("Invalid API KEY")
  })
})
