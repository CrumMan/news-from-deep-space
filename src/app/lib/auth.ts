import jwt from "jsonwebtoken";

export type TokenPayload = {
  accountId: string;
  username: string;
  isAdmin: boolean;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it to .env.local before running the API.",
    );
  }
  return secret;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export function extractToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  const [scheme, value] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !value) return null;
  return value;
}
