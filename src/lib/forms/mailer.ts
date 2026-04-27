import { Resend } from "resend";

const INTERNAL_RECIPIENT = "khuongbinh.info@gmail.com";
const DEFAULT_FROM = "THL B2B <onboarding@resend.dev>";

type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

let resendClient: Resend | null = null;

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
