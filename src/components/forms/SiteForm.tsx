"use client";

import { useActionState, useId } from "react";
import { submitForm } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { forms, type Field, type FormKind, type FormState } from "@/lib/forms";

const initialState: FormState = { status: "idle" };

const control =
  "w-full rounded-field border border-[rgb(21_24_26/0.18)] bg-paper px-3.5 text-[0.9375rem] text-ink transition-colors duration-150 placeholder:text-ink-soft/60 hover:border-[rgb(21_24_26/0.35)] focus:border-ink focus:outline-none aria-[invalid=true]:border-[#b4321f]";

const errorText = "mt-1.5 text-micro text-[#b4321f]";

/** Renders one of the declarative forms in `lib/forms` and submits via server action. */
export function SiteForm({ kind, defaults }: { kind: FormKind; defaults?: Record<string, string> }) {
  const def = forms[kind];
  const [state, action, pending] = useActionState(submitForm, initialState);
  const id = useId();

  if (state.status === "success") {
    return (
      <div role="status" className="enter border-t border-ink pt-6">
        <p className="text-sub">{def.successTitle}</p>
        <p className="mt-2 max-w-[44ch] text-lede text-ink-soft">{def.successBody}</p>
      </div>
    );
  }

  const value = (name: string) => state.values?.[name] ?? defaults?.[name];

  return (
    <form action={action} noValidate className="relative grid max-w-3xl grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      <input type="hidden" name="kind" value={kind} />
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {def.fields.map((field: Field) => {
        const fieldId = `${id}-${field.name}`;
        const error = state.errors?.[field.name];
        const errorId = error ? `${fieldId}-error` : undefined;
        const wide = field.type === "checkbox" || field.type === "textarea" || !("half" in field && field.half);

        if (field.type === "checkbox") {
          return (
            <div key={field.name} className="sm:col-span-2">
              <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-3 text-small text-ink-soft">
                <input
                  id={fieldId}
                  type="checkbox"
                  name={field.name}
                  defaultChecked={value(field.name) === "yes"}
                  aria-invalid={Boolean(error)}
                  aria-describedby={errorId}
                  className="mt-0.5 size-4 shrink-0 accent-ink"
                />
                <span>{field.label}</span>
              </label>
              {error ? (
                <p id={errorId} className={cn(errorText, "pl-7")}>
                  {error}
                </p>
              ) : null}
            </div>
          );
        }

        return (
          <div key={field.name} className={cn(wide && "sm:col-span-2")}>
            <label htmlFor={fieldId} className="mb-1.5 block text-small font-medium">
              {field.label}
              {field.required ? null : <span className="font-normal text-ink-soft"> (optional)</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={fieldId}
                name={field.name}
                rows={4}
                required={field.required}
                placeholder={field.placeholder}
                defaultValue={value(field.name)}
                aria-invalid={Boolean(error)}
                aria-describedby={errorId}
                className={cn(control, "min-h-32 resize-y py-2.5")}
              />
            ) : field.type === "select" ? (
              <div className="relative">
                <select
                  id={fieldId}
                  name={field.name}
                  required={field.required}
                  defaultValue={value(field.name) ?? ""}
                  aria-invalid={Boolean(error)}
                  aria-describedby={errorId}
                  className={cn(control, "h-11 appearance-none pr-10")}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-soft"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <input
                id={fieldId}
                type={field.type}
                name={field.name}
                required={field.required}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                defaultValue={value(field.name)}
                aria-invalid={Boolean(error)}
                aria-describedby={errorId}
                className={cn(control, "h-11")}
              />
            )}
            {error ? (
              <p id={errorId} className={errorText}>
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="flex flex-col gap-4 pt-3 sm:col-span-2 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending} className="disabled:opacity-60">
          {pending ? "Sending…" : def.submitLabel}
        </Button>
        <p aria-live="polite" className="text-small text-ink-soft">
          {state.status === "error" ? state.message : null}
        </p>
      </div>
    </form>
  );
}
