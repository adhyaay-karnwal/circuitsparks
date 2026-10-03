"use server";

import { forms, type FormKind, type FormState } from "@/lib/forms";
import { site } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 4000;

/**
 * Validates a site form and forwards it as JSON to FORMS_WEBHOOK_URL
 * (Formspree, Zapier, Google Apps Script, etc.).
 */
export async function submitForm(_prev: FormState, formData: FormData): Promise<FormState> {
  const kind = String(formData.get("kind") ?? "") as FormKind;
  const def = forms[kind];
  if (!def) return { status: "error", message: "Unknown form." };

  // Honeypot: real visitors never see or fill this field.
  if (formData.get("website")) return { status: "success" };

  const values: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const field of def.fields) {
    const raw = formData.get(field.name);
    const value = field.type === "checkbox" ? (raw ? "yes" : "") : String(raw ?? "").trim();
    values[field.name] = value;

    if (field.required && !value) {
      errors[field.name] = field.type === "checkbox" ? "Please confirm to continue." : "This field is required.";
    } else if (field.type === "email" && value && !EMAIL.test(value)) {
      errors[field.name] = "Enter a valid email address.";
    } else if (value.length > MAX_LENGTH) {
      errors[field.name] = "Please keep this under 4,000 characters.";
    } else if (field.type === "select" && value && !field.options.includes(value)) {
      errors[field.name] = "Choose one of the options.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const endpoint = process.env.FORMS_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "error",
      message: `Online submissions aren't connected yet. Please email ${site.email} and we'll take it from there.`,
      values,
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ form: kind, submittedAt: new Date().toISOString(), ...values }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("Form submission failed", err);
    return {
      status: "error",
      message: `Something went wrong sending your submission. Please try again, or email ${site.email}.`,
      values,
    };
  }

  return { status: "success" };
}
