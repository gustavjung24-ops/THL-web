import { randomUUID } from "node:crypto";
import { readJsonFile, writeJsonFile } from "@/lib/admin/storage";

export type AdminAuditAction =
  | "auth.otp_requested"
  | "auth.otp_failed"
  | "auth.otp_verified"
  | "auth.otp_mail_failed"
  | "auth.payload_invalid"
  | "auth.unsupported_action"
  | "quote.updated"
  | "quote.not_found"
  | "mail.sent"
  | "mail.send_failed"
  | "user.created"
  | "user.updated"
  | "user.update_failed";

export type AdminAuditRecord = {
  id: string;
  createdAt: string;
  actorEmail: string;
  action: AdminAuditAction;
  targetId?: string;
  message?: string;
  meta?: Record<string, string | number | boolean | null>;
};

const AUDIT_FILE = "admin-audit-log.json";
const MAX_LOG_ITEMS = 2000;

export async function appendAdminAuditLog(input: Omit<AdminAuditRecord, "id" | "createdAt">) {
  const current = await readJsonFile<AdminAuditRecord[]>(AUDIT_FILE, []);
  const next: AdminAuditRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    actorEmail: input.actorEmail,
    action: input.action,
    targetId: input.targetId,
    message: input.message,
    meta: input.meta,
  };

  const merged = [next, ...current].slice(0, MAX_LOG_ITEMS);
  await writeJsonFile(AUDIT_FILE, merged);
  return next;
}