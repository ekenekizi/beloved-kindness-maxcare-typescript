export class SubmissionError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export type EmailField = { label: string; value: string };
export type ValidatedEnquiry = { replyTo: string; fields: EmailField[] };
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new SubmissionError("Please check your form details.");
  return value as Record<string, unknown>;
}
function text(
  data: Record<string, unknown>,
  key: string,
  label: string,
  required = true,
  max = 150,
): string {
  const raw = data[key] ?? "";
  if (typeof raw !== "string")
    throw new SubmissionError("Please check " + label.toLowerCase() + ".");
  const value = raw.trim();
  if (
    (required && !value) ||
    value.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
  )
    throw new SubmissionError("Please check " + label.toLowerCase() + ".");
  if (key === "phone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
      throw new SubmissionError("Please enter a valid phone number.");
  }
  return value;
}
function email(data: Record<string, unknown>): string {
  const value = text(data, "email", "Email address", true, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    throw new SubmissionError("Please enter a valid email address.");
  return value;
}
function option(
  data: Record<string, unknown>,
  key: string,
  label: string,
  options: readonly string[],
  required = false,
): string {
  const value = text(data, key, label, required);
  if (value && !options.includes(value))
    throw new SubmissionError("Please check " + label.toLowerCase() + ".");
  return value;
}
function choices(
  data: Record<string, unknown>,
  key: string,
  allowed: readonly string[],
): string[] {
  const value = data[key] ?? [];
  if (
    !Array.isArray(value) ||
    value.length > allowed.length ||
    value.some((item) => typeof item !== "string" || !allowed.includes(item))
  )
    throw new SubmissionError("Please check your selected support options.");
  return [...new Set(value as string[])];
}
export function validateMembership(input: unknown): ValidatedEnquiry {
  const data = object(input);
  if (data.consent !== true)
    throw new SubmissionError(
      "Please agree to being contacted about your application.",
    );
  const replyTo = email(data);
  const fields: EmailField[] = [];
  for (const [key, label] of [
    ["fullName", "Full name"],
    ["phone", "Phone"],
    ["countryOfOrigin", "Country of origin"],
    ["stateOfOrigin", "State of origin"],
    ["countryOfResidence", "Country of residence"],
    ["stateOfResidence", "State of residence"],
  ]) {
    const value = text(data, key, label);
    if (key === "fullName" && value.length < 2)
      throw new SubmissionError("Please enter your full name.");
    fields.push({ label, value });
  }
  fields.push({ label: "Email", value: replyTo });
  fields.push({
    label: "Gender",
    value:
      option(
        data,
        "gender",
        "Gender",
        ["Male", "Female", "Prefer not to say"],
        true,
      ) || "Not provided",
  });
  fields.push({
    label: "Employment status",
    value: option(
      data,
      "employmentStatus",
      "Employment status",
      [
        "Employed",
        "Self-employed",
        "Student",
        "Unemployed",
        "Retired",
        "Prefer not to say",
      ],
      true,
    ),
  });
  fields.push({
    label: "Referral source",
    value: option(
      data,
      "referralSource",
      "Referral source",
      [
        "Social media",
        "Friend or family",
        "Our website",
        "Community outreach",
        "Church or organization",
        "Other",
      ],
      true,
    ),
  });
  fields.push({
    label: "Motivation",
    value:
      text(data, "motivation", "Motivation", false, 2000) || "Not provided",
  });
  fields.push({
    label: "Contact consent",
    value: "Granted for membership and volunteering communication",
  });
  return { replyTo, fields };
}
const food = [
  "Rice",
  "Groundnut oil",
  "Spaghetti",
  "Noodles",
  "Beans",
  "Semolina",
  "Garri",
  "Salt",
  "Seasoning cubes",
];
export function validatePartnership(input: unknown): ValidatedEnquiry {
  const review = object(input),
    data = object(review.values);
  const areas = choices(review, "areas", ["orphanage", "widows"]);
  if (!areas.length)
    throw new SubmissionError("Choose at least one partnership area.");
  const replyTo = email(data);
  const fields: EmailField[] = [];
  for (const [key, label] of [
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["phone", "Phone"],
    ["countryOfOrigin", "Country of origin"],
    ["countryOfResidence", "Country of residence"],
  ])
    fields.push({ label, value: text(data, key, label) });
  fields.push({ label: "Email", value: replyTo });
  fields.push({
    label: "Gender",
    value:
      option(data, "gender", "Gender", [
        "male",
        "female",
        "prefer-not-to-say",
      ]) || "Not provided",
  });
  fields.push({
    label: "Partnership areas",
    value: areas
      .map((area) =>
        area === "orphanage" ? "Orphanage homes" : "Widow empowerment",
      )
      .join(", "),
  });
  if (areas.includes("orphanage")) {
    fields.push({
      label: "Education support",
      value:
        choices(data, "orphanageEducation", ["School fees", "Stationery"]).join(
          ", ",
        ) || "To be discussed",
    });
    fields.push({
      label: "Healthcare support",
      value:
        text(data, "healthcare", "Healthcare support", false, 1500) ||
        "Not provided",
    });
    fields.push({
      label: "Orphanage supplies",
      value:
        choices(data, "orphanageSupplies", [...food, "Clothes"]).join(", ") ||
        "To be discussed",
    });
  }
  if (areas.includes("widows")) {
    fields.push({
      label: "Widow support",
      value:
        choices(data, "widowSupport", [
          "Career / business empowerment",
          "Rent / accommodation",
        ]).join(", ") || "To be discussed",
    });
    fields.push({
      label: "Widow supplies",
      value:
        choices(data, "widowSupplies", food).join(", ") || "To be discussed",
    });
  }
  return { replyTo, fields };
}
