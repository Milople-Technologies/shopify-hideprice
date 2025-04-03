import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["your-secret-key"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const getSession = (cookieHeader: string | null) =>
  sessionStorage.getSession(cookieHeader);
export const commitSession = (session: any) =>
  sessionStorage.commitSession(session);
