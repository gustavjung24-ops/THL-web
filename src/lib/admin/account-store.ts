import { randomUUID } from "node:crypto";
import {
  AdminPermission,
  AdminRole,
  getFixedSuperAdminEmail,
  getOwnerAdminPassword,
  getRolePermissions,
  hashPassword,
} from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/storage";

export type ManagedAdminAccountRecord = {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  passwordHash: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const USERS_FILE = "admin-users.json";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

async function readAccounts() {
  return readJsonFile<ManagedAdminAccountRecord[]>(USERS_FILE, []);
}

async function writeAccounts(accounts: ManagedAdminAccountRecord[]) {
  await writeJsonFile(USERS_FILE, accounts);
}

export async function getOwnerAccount() {
  return {
    id: "owner",
    email: normalizeEmail(getFixedSuperAdminEmail()),
    displayName: "Owner THL",
    role: "owner" as const,
    permissions: getRolePermissions("owner"),
    passwordHash: await hashPassword(getOwnerAdminPassword()),
    active: true,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
}

export async function listManagedAdminAccounts() {
  const owner = await getOwnerAccount();
  const accounts = await readAccounts();
  return [owner, ...accounts].sort((left, right) => left.email.localeCompare(right.email));
}

export async function getAdminAccountByCredentialsFromStore(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  const owner = await getOwnerAccount();
  if (owner.email === normalizedEmail && owner.passwordHash === passwordHash) {
    return owner;
  }

  const accounts = await readAccounts();
  return accounts.find((account) => account.active && account.email === normalizedEmail && account.passwordHash === passwordHash) ?? null;
}

export async function createManagedAdminAccount(input: {
  email: string;
  displayName: string;
  role: Exclude<AdminRole, "owner">;
  permissions?: AdminPermission[];
  password: string;
}) {
  const accounts = await readAccounts();
  const normalizedEmail = normalizeEmail(input.email);
  const ownerEmail = normalizeEmail(getFixedSuperAdminEmail());
  if (normalizedEmail === ownerEmail) {
    throw new Error("Không thể tạo trùng với tài khoản owner.");
  }
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("Email admin đã tồn tại.");
  }

  const now = new Date().toISOString();
  const nextAccount: ManagedAdminAccountRecord = {
    id: randomUUID(),
    email: normalizedEmail,
    displayName: input.displayName.trim(),
    role: input.role,
    permissions: (input.permissions && input.permissions.length > 0 ? input.permissions : getRolePermissions(input.role)) as AdminPermission[],
    passwordHash: await hashPassword(input.password),
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  await writeAccounts([nextAccount, ...accounts]);
  return nextAccount;
}

export async function updateManagedAdminAccount(
  id: string,
  input: Partial<Pick<ManagedAdminAccountRecord, "displayName" | "role" | "permissions" | "active">> & { password?: string },
) {
  const accounts = await readAccounts();
  const nextAccounts = await Promise.all(
    accounts.map(async (account) => {
      if (account.id !== id) {
        return account;
      }

      return {
        ...account,
        displayName: input.displayName?.trim() || account.displayName,
        role: input.role || account.role,
        permissions: input.permissions && input.permissions.length > 0 ? input.permissions : account.permissions,
        active: typeof input.active === "boolean" ? input.active : account.active,
        passwordHash: input.password ? await hashPassword(input.password) : account.passwordHash,
        updatedAt: new Date().toISOString(),
      };
    }),
  );

  await writeAccounts(nextAccounts);
  return nextAccounts.find((account) => account.id === id) ?? null;
}