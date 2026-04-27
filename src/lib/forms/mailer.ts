import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const INTERNAL_RECIPIENT = "khuongbinh.info@gmail.com";
const DEFAULT_FROM = "THL B2B <onboarding@resend.dev>";
const DEFAULT_ASSET_BASE_URL = `https://${siteConfig.domain}`;

type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

let resendClient: Resend | null = null;

function normalizeAssetBaseUrl(rawUrl: string) {
  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getInternalRecipient() {
  return INTERNAL_RECIPIENT;
}

export function getMailFromAddress() {
  return process.env.FORM_MAIL_FROM ?? DEFAULT_FROM;
}

export function getMailAssetBaseUrl() {
  const configured = process.env.FORM_ASSET_BASE_URL;
  return normalizeAssetBaseUrl(configured && configured.trim().length > 0 ? configured : DEFAULT_ASSET_BASE_URL);
}

export function buildMailBrandHeaderHtml() {
  const baseUrl = getMailAssetBaseUrl();
  const ntnLogo = `${baseUrl}/images/brands/ntn-logo.png`;
  const tsubakiLogo = `${baseUrl}/images/brands/tsubaki-logo.png`;
  const koyoLogo = `${baseUrl}/images/brands/koyo-logo.png`;
  const nokLogo = `${baseUrl}/images/brands/nok-corporation.png`;
  const sohoLogo = `${baseUrl}/images/brands/soho-logo-transparent.png`;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 0 18px 0;">
      <tr>
        <td style="padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
          <div style="margin:0 0 10px 0;padding:10px;border:1px solid #cbd5e1;border-radius:10px;background:#ffffff;text-align:center;">
            <img src="${ntnLogo}" alt="NTN" style="height:34px;width:auto;max-width:180px;display:inline-block;" />
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;">
            <div style="padding:6px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;">
              <img src="${tsubakiLogo}" alt="Tsubaki" style="height:18px;width:auto;max-width:96px;display:inline-block;" />
            </div>
            <div style="padding:6px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;">
              <img src="${koyoLogo}" alt="Koyo" style="height:18px;width:auto;max-width:96px;display:inline-block;" />
            </div>
            <div style="padding:6px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;">
              <img src="${nokLogo}" alt="NOK" style="height:18px;width:auto;max-width:96px;display:inline-block;" />
            </div>
            <div style="padding:6px;border:1px solid #e2e8f0;border-radius:8px;background:#ffffff;text-align:center;">
              <img src="${sohoLogo}" alt="Soho" style="height:18px;width:auto;max-width:96px;display:inline-block;" />
            </div>
          </div>
        </td>
      </tr>
    </table>
  `;
}

export async function sendMail(input: SendMailInput) {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getMailFromAddress(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}
