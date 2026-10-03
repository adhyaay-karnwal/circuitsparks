/**
 * Declarative form definitions shared by the client form renderer and the
 * server action that validates submissions.
 */

export type Field =
  | { type: "text" | "email" | "tel"; name: string; label: string; required?: boolean; autoComplete?: string; half?: boolean; placeholder?: string }
  | { type: "select"; name: string; label: string; required?: boolean; options: string[]; half?: boolean }
  | { type: "textarea"; name: string; label: string; required?: boolean; placeholder?: string }
  | { type: "checkbox"; name: string; label: string; required?: boolean };

export type FormDefinition = {
  fields: Field[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
};

export const forms = {
  register: {
    submitLabel: "Submit registration",
    successTitle: "You're on the list.",
    successBody: "We'll email you with workshop dates and locations as soon as the next series opens.",
    fields: [
      { type: "text", name: "guardianName", label: "Parent or guardian name", required: true, autoComplete: "name", half: true },
      { type: "email", name: "email", label: "Email", required: true, autoComplete: "email", half: true },
      { type: "text", name: "studentName", label: "Student first name", required: true, half: true },
      { type: "select", name: "grade", label: "Grade (this school year)", required: true, options: ["5th", "6th", "7th", "8th", "9th"], half: true },
      { type: "text", name: "zip", label: "ZIP code", required: true, autoComplete: "postal-code", half: true },
      { type: "select", name: "tier", label: "Tier of interest", options: ["Not sure yet", "Spark · Foundations", "Current · Microcontrollers", "Signal · Sensors & systems"], half: true },
      { type: "textarea", name: "notes", label: "Anything we should know?", placeholder: "Accessibility needs, prior experience, preferred location…" },
      { type: "checkbox", name: "consent", label: "I am this student's parent or legal guardian and agree to be contacted about CircuitSparks workshops.", required: true },
    ],
  },
  mentor: {
    submitLabel: "Submit application",
    successTitle: "Application received.",
    successBody: "Thanks for applying. We'll review your application and reach out about next steps and training dates.",
    fields: [
      { type: "text", name: "name", label: "Full name", required: true, autoComplete: "name", half: true },
      { type: "email", name: "email", label: "Email", required: true, autoComplete: "email", half: true },
      { type: "text", name: "school", label: "High school", required: true, half: true },
      { type: "select", name: "grade", label: "Grade", required: true, options: ["9th", "10th", "11th", "12th"], half: true },
      { type: "textarea", name: "experience", label: "What have you built or taught?", required: true, placeholder: "Robotics, electronics projects, coding, tutoring… anything counts." },
      { type: "textarea", name: "why", label: "Why do you want to mentor?", required: true },
      { type: "text", name: "availability", label: "Typical availability", placeholder: "e.g. Saturday mornings, weekday afternoons" },
    ],
  },
  contact: {
    submitLabel: "Send message",
    successTitle: "Message sent.",
    successBody: "Thanks for reaching out. A member of our team will reply by email.",
    fields: [
      { type: "text", name: "name", label: "Name", required: true, autoComplete: "name", half: true },
      { type: "email", name: "email", label: "Email", required: true, autoComplete: "email", half: true },
      { type: "text", name: "organization", label: "Organization", autoComplete: "organization", half: true },
      { type: "select", name: "topic", label: "Topic", required: true, options: ["Host a workshop", "Hardware sponsorship", "Donations", "Press", "Something else"], half: true },
      { type: "textarea", name: "message", label: "Message", required: true },
    ],
  },
} satisfies Record<string, FormDefinition>;

export type FormKind = keyof typeof forms;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};
