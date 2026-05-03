import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export type AdminPermission =
  | "quotes:read"
  | "quotes:write"
  | "quotes:status"
  | "mail:send"
  | "users:create"
  | "users:manage";

export type AdminRole = "owner" | "manager" | "staff";

export type AdminSession = {
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  exp: number;
  version: "v1";
};

export type AdminOtpState = {
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  code: string;
  exp: number;
  version: "otp-v1";
};

export const ADMIN_COOKIE_NAME = "thl_admin_session";
export const ADMIN_OTP_COOKIE_NAME = "thl_admin_otp";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000;

export const ADMIN_PERMISSION_LABELS: Record<AdminPermission, string> = {
  "quotes:read": "Xem báo giá",
  "quotes:write": "Sửa draft báo giá",
  "quotes:status": "Cập nhật trạng thái",
  "mail:send": "Gửi mail admin",
  "users:create": "Tạo tài khoản",
  "users:manage": "Quản lý tài khoản",
};

export const ROLE_PRESETS: Record<AdminRole, AdminPermission[]> = {
  owner: ["quotes:read", "quotes:write", "quotes:status", "mail:send", "users:create", "users:manage"],
  manager: ["quotes:read", "quotes:write", "quotes:status", "mail:send"],
  staff: ["quotes:read", "quotes:write", "quotes:status"],
};

function readAdminSecret() {
  const configured = process.env.ADMIN_SECRET?.trim();
  if (!configured) {
    throw new Error("ADMIN_SECRET is required");
  }
  return configured;
}

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]!);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function toBase64Url(base64: string) {
  return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padding = normalized.length % 4;
  if (padding === 0) {
    return normalized;
  }
  return normalized.padEnd(normalized.length + (4 - padding), "=");
}

function base64UrlEncode(input: string) {
  return toBase64Url(bytesToBase64(textEncoder.encode(input)));
}

function base64UrlDecode(input: string) {
  return textDecoder.decode(base64ToBytes(fromBase64Url(input)));
}

async function signString(input: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(readAdminSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(input));
  return toBase64Url(bytesToBase64(new Uint8Array(signature)));
}

async function createSignedToken(payload: object) {
  const json = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(json);
  const signature = await signString(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifySignedToken<T>(token: string | undefined | null): Promise<T | null> {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await signString(encodedPayload);
  if (expectedSignature !== signature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(encodedPayload)) as T;
  } catch {
    return null;
  }
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminOtpCookieName() {
  return ADMIN_OTP_COOKIE_NAME;
}

export function getFixedSuperAdminEmail() {
  return readRequiredEnv("ADMIN_OWNER_EMAIL").toLowerCase();
}

export function getOwnerAdminPassword() {
  return readRequiredEnv("ADMIN_OWNER_PASSWORD");
}

export function getRolePermissions(role: AdminRole) {
  return ROLE_PRESETS[role];
}

export function hasAdminPermission(session: Pick<AdminSession, "role" | "permissions">, permission: AdminPermission) {
  if (session.role === "owner") {
    return true;
  }
  return session.permissions.includes(permission);
}

export async function hashPassword(password: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(`${readAdminSecret()}::${password.trim()}`),
  );
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

export async function createAdminSessionToken(input: {
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
}) {
  return createSignedToken({
    email: input.email,
    role: input.role,
    permissions: input.permissions,
    exp: Date.now() + SESSION_TTL_MS,
    version: "v1",
  } satisfies AdminSession);
}

export async function createAdminOtpStateToken(input: {
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  code: string;
}) {
  return createSignedToken({
    email: input.email,
    role: input.role,
    permissions: input.permissions,
    code: input.code,
    exp: Date.now() + OTP_TTL_MS,
    version: "otp-v1",
  } satisfies AdminOtpState);
}

export async function getVerifiedAdminSession(token: string | undefined | null) {
  const parsed = await verifySignedToken<AdminSession>(token);
  if (!parsed || parsed.version !== "v1" || parsed.exp <= Date.now()) {
    return null;
  }
  return parsed;
}

export async function getVerifiedAdminOtpState(token: string | undefined | null) {
  const parsed = await verifySignedToken<AdminOtpState>(token);
  if (!parsed || parsed.version !== "otp-v1" || parsed.exp <= Date.now()) {
    return null;
  }
  return parsed;
}

export function generateOtpCode() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return value.toString().padStart(6, "0");
}

export function getAdminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function getAdminSessionMaxAgeSeconds() {
  return Math.floor(SESSION_TTL_MS / 1000);
}

export function getAdminOtpMaxAgeSeconds() {
  return Math.floor(OTP_TTL_MS / 1000);
}