"use client";

import { useState } from "react";
import { type AdminPermission, type AdminRole, ADMIN_PERMISSION_LABELS, ROLE_PRESETS } from "@/lib/admin/auth";
import type { ManagedAdminAccountRecord } from "@/lib/admin/account-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminUserManagerProps = {
  accounts: ManagedAdminAccountRecord[];
};

const permissions = Object.keys(ADMIN_PERMISSION_LABELS) as AdminPermission[];

export function AdminUserManager({ accounts }: AdminUserManagerProps) {
  const [localAccounts, setLocalAccounts] = useState(accounts);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<AdminRole, "owner">>("staff");
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>(ROLE_PRESETS.staff);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function togglePermission(permission: AdminPermission) {
    setSelectedPermissions((current) =>
      current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission],
    );
  }

  async function createUser() {
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password, role, permissions: selectedPermissions }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; account?: ManagedAdminAccountRecord };
      if (!response.ok || !data.ok || !data.account) {
        setError(data.error ?? "Không thể tạo tài khoản admin.");
        return;
      }
      const nextAccount = data.account;
      setLocalAccounts((current) => [nextAccount, ...current]);
      setDisplayName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      setSelectedPermissions(ROLE_PRESETS.staff);
      setMessage("Đã tạo tài khoản admin.");
    } catch {
      setError("Không thể tạo tài khoản admin.");
    }
  }

  async function updateUser(account: ManagedAdminAccountRecord, active: boolean) {
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; account?: ManagedAdminAccountRecord };
      if (!response.ok || !data.ok || !data.account) {
        setError(data.error ?? "Không thể cập nhật tài khoản.");
        return;
      }
      const nextAccount = data.account;
      setLocalAccounts((current) => current.map((item) => (item.id === account.id ? nextAccount : item)));
      setMessage("Đã cập nhật tài khoản.");
    } catch {
      setError("Không thể cập nhật tài khoản.");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Tạo tài khoản admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">Tên hiển thị</Label>
              <Input id="user-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-password">Mật khẩu</Label>
              <Input id="user-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Vai trò</Label>
              <select
                id="user-role"
                value={role}
                onChange={(event) => {
                  const nextRole = event.target.value as Exclude<AdminRole, "owner">;
                  setRole(nextRole);
                  setSelectedPermissions(ROLE_PRESETS[nextRole]);
                }}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="staff">staff</option>
                <option value="manager">manager</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quyền</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {permissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input type="checkbox" checked={selectedPermissions.includes(permission)} onChange={() => togglePermission(permission)} />
                  {ADMIN_PERMISSION_LABELS[permission]}
                </label>
              ))}
            </div>
          </div>
          <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={createUser} disabled={!displayName || !email || !password}>
            Tạo tài khoản
          </Button>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p> : null}
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Tài khoản hiện có</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {localAccounts.map((account) => (
            <div key={account.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{account.displayName}</p>
                <p className="text-sm text-slate-600">{account.email}</p>
                <p className="mt-1 text-xs text-slate-500">{account.role} | {account.permissions.join(", ")}</p>
              </div>
              {account.role !== "owner" ? (
                <Button type="button" variant="outline" onClick={() => updateUser(account, !account.active)}>
                  {account.active ? "Khoá tài khoản" : "Kích hoạt lại"}
                </Button>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}