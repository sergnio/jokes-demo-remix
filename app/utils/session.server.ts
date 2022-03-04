import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "remix";

type TrimmedUser = { id: string; username: string };

export const login = async (
  username: string,
  password: string
): Promise<TrimmedUser | null> => {
  const result = await db.user.findUnique({ where: { username } });
  if (!result) {
    return null;
  }
  const isCorrectPassword = await bcrypt.compare(password, result.passwordHash);
  return isCorrectPassword ? { id: result.id, username } : null;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};
