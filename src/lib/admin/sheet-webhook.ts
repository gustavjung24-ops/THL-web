type SheetWebhookPayload = {
  action: string;
  payload: Record<string, unknown>;
};

function readWebhookUrl(): string {
  return process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim() ?? "";
}

function readWebhookSecret(): string {
  return process.env.GOOGLE_SHEET_WEBHOOK_SECRET?.trim() ?? "";
}

export async function callSheetWebhook(input: SheetWebhookPayload): Promise<unknown> {
  const url = readWebhookUrl();
  if (!url) {
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = readWebhookSecret();
  if (secret) {
    headers["x-admin-webhook-secret"] = secret;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const raw = await response.text();
  const parsed = (() => {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return raw;
    }
  })();

  if (!response.ok) {
    throw new Error(typeof parsed === "string" ? parsed : "Sheet webhook request failed.");
  }

  return parsed;
}
