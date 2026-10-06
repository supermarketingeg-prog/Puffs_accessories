import { createHmac, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const COOKIE_NAME = "puffs_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

function requiredEnv(name: "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`إعداد ${name} مفقود من بيئة النشر.`);
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", requiredEnv("ADMIN_SESSION_SECRET")).update(payload).digest("base64url");
}

function matches(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function readSession() {
  const token = getCookie(COOKIE_NAME);
  if (!token) return false;
  const [expiresAt, sentSignature] = token.split(".");
  if (!expiresAt || !sentSignature || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Date.now()) return false;
  return matches(sentSignature, signature(expiresAt));
}

export function requireAdminSession() {
  if (!readSession()) throw Object.assign(new Error("Unauthorized"), { status: 401 });
}

export function startAdminSession(password: string) {
  if (!matches(password, requiredEnv("ADMIN_PASSWORD"))) {
    throw Object.assign(new Error("كلمة السر غير صحيحة"), { status: 401 });
  }
  const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
  setCookie(COOKIE_NAME, `${expiresAt}.${signature(expiresAt)}`, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_SECONDS,
  });
}

export function endAdminSession() {
  setCookie(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}
