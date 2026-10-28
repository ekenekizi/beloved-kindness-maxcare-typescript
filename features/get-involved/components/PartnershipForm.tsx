"use client";

import { Reveal } from "@/components/animation/HomepageMotion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { ArrowRight, LoaderCircle, School, Sprout, X } from "lucide-react";

import {
  defaultPartnerContent,
  type PartnershipContent,
} from "../data/involvement-content";

import { submitEnquiry } from "../data/submit-enquiry";
import ShareForm from "@/components/ui/ShareForm";

type PartnershipArea = "orphanage" | "widows";

type PartnershipValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryOfOrigin: string;
  countryOfResidence: string;
  gender: string;
  orphanageEducation: string[];
  healthcare: string;
  orphanageSupplies: string[];
  widowSupport: string[];
  widowSupplies: string[];
};

type PartnershipReview = {
  areas: PartnershipArea[];
  values: PartnershipValues;
};

const foodSupplies = [
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

const contactFields = [
  {
    name: "firstName",
    label: "First name",
    placeholder: "Your first name",
    type: "text",
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Last name",
    placeholder: "Your last name",
    type: "text",
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Mobile number",
    placeholder: "Include country code",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "countryOfOrigin",
    label: "Country of origin",
    placeholder: "e.g. Nigeria",
    type: "text",
    autoComplete: "off",
  },
  {
    name: "countryOfResidence",
    label: "Country of residence",
    placeholder: "Where you live now",
    type: "text",
    autoComplete: "country-name",
  },
] as const;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: FieldError;
  children: ReactNode;
}) {
  return (
    <div className="partnership-field">
      <label htmlFor={id}>{label}</label>
      {children}

      {error && (
        <p id={`${id}-error`} className="partnership-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function PartnershipForm({
  content = defaultPartnerContent.partnership,
}: { content?: PartnershipContent } = {}) {
  const processSteps = content.steps;
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sending = useRef(false);
  const submissionId = useRef<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const [selectedAreas, setSelectedAreas] = useState<PartnershipArea[]>([
    "orphanage",
  ]);
  const [areaError, setAreaError] = useState("");
  const [review, setReview] = useState<PartnershipReview | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnershipValues>({
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryOfOrigin: "",
      countryOfResidence: "",
      gender: "",
      orphanageEducation: [],
      healthcare: "",
      orphanageSupplies: [],
      widowSupport: [],
      widowSupplies: [],
    },
  });

  useEffect(() => {
    if (review && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [review]);

  function toggleArea(area: PartnershipArea) {
    setSelectedAreas((current) =>
      current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area],
    );

    setAreaError("");
  }

  function openReview(values: PartnershipValues) {
    setSubmitError("");
    setSubmitted(false);
    if (!selectedAreas.length) {
      setAreaError("Choose at least one partnership area.");
      document.getElementById("partnership-areas")?.scrollIntoView({
        block: "start",
      });
      document.getElementById("orphanage-area-button")?.focus();
      return;
    }

    setAreaError("");
    submissionId.current = crypto.randomUUID();
    setReview({
      areas: [...selectedAreas],
      values,
    });
  }

  async function submitPartnership() {
    if (!review || sending.current) return;
    sending.current = true;
    setIsSending(true);
    setSubmitError("");
    try {
      submissionId.current ??= crypto.randomUUID();
      await submitEnquiry(
        "partnership",
        review,
        submissionId.current,
        honeypot.current?.value ?? "",
      );
      reset();
      if (honeypot.current) honeypot.current.value = "";
      setSubmitted(true);
      dialogRef.current?.close();
      setReview(null);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't submit your enquiry. Please try again.",
      );
    } finally {
      sending.current = false;
      setIsSending(false);
    }
  }

  const orphanageSelected = selectedAreas.includes("orphanage");
  const widowsSelected = selectedAreas.includes("widows");

  const selectedAreaLabels = selectedAreas.map((area) =>
    area === "orphanage" ? "Orphanage homes" : "Widow empowerment",
  );

  return (
    <>
      <div className="partnership-container">
        {submitted && (
          <p
            ref={successRef}
            tabIndex={-1}
            role="status"
            className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-800"
          >
            Thank you! Your partnership enquiry has been submitted.
          </p>
        )}
        <section
          id="partnership-areas"
          className="partnership-areas"
          aria-labelledby="partnership-areas-heading"
        >
          <Reveal as="div" className="partnership-section-heading">
            <h2 id="partnership-areas-heading">
              {content.areasHeadingLines.map((line, index) => (
                <span className="block" key={index}>
                  {line}
                </span>
              ))}
            </h2>

            <p>{content.areasDescription}</p>
          </Reveal>

          <Reveal
            as="div"
            className="partnership-choices"
            role="group"
            aria-label="Choose partnership areas"
            aria-describedby={areaError ? "partnership-area-error" : undefined}
          >
            <button
              id="orphanage-area-button"
              type="button"
              aria-pressed={orphanageSelected}
              aria-controls="orphanage-support-fields"
              onClick={() => toggleArea("orphanage")}
              className="partnership-choice"
            >
              <span className="partnership-choice-icon">
                <School size={22} aria-hidden="true" />
              </span>

              <span className="partnership-choice-content">
                <span className="partnership-choice-title">
                  Orphanage homes
                </span>

                <span className="partnership-choice-description">
                  {content.orphanageDescription}
                </span>

                <span className="partnership-choice-foot">
                  {content.orphanageFootnote}
                </span>
              </span>

              <span className="partnership-selection-dot" aria-hidden="true">
                {orphanageSelected ? "✓" : ""}
              </span>
            </button>

            <button
              type="button"
              aria-pressed={widowsSelected}
              aria-controls="widow-support-fields"
              onClick={() => toggleArea("widows")}
              className="partnership-choice"
            >
              <span className="partnership-choice-icon partnership-choice-icon-gold">
                <Sprout size={22} aria-hidden="true" />
              </span>

              <span className="partnership-choice-content">
                <span className="partnership-choice-title">
                  Widow empowerment
                </span>

                <span className="partnership-choice-description">
                  {content.widowDescription}
                </span>

                <span className="partnership-choice-foot">
                  {content.widowFootnote}
                </span>
              </span>

              <span className="partnership-selection-dot" aria-hidden="true">
                {widowsSelected ? "✓" : ""}
              </span>
            </button>
          </Reveal>

          {areaError && (
            <p
              id="partnership-area-error"
              className="partnership-error"
              role="alert"
            >
              {areaError}
            </p>
          )}
        </section>
      </div>

      <section
        id="partnership-form"
        className="partnership-form-band"
        aria-labelledby="partnership-form-heading"
      >
        <div className="partnership-container partnership-form-layout">
          <Reveal as="aside" className="partnership-form-intro">
            <p className="partnership-eyebrow">{content.formLabel}</p>

            <h2 id="partnership-form-heading">
              {content.formHeadingLines.map((line, index) => (
                <span className="block" key={index}>
                  {line}
                </span>
              ))}
            </h2>

            <p>{content.formDescription}</p>

            <ol className="partnership-process">
              {processSteps.map((step, index) => (
                <li key={step.id}>
                  <span className="partnership-process-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="partnership-small-note">{content.formFootnote}</p>
          </Reveal>

          <form
            className="partnership-form-sheet"
            onSubmit={(event) => {
              void handleSubmit(openReview)(event);
            }}
            noValidate
          >
            <span>
              <ShareForm
                title="Partner with Beloved Kindness Maxcare"
                path="/get-involved/partner#partnership-form"
              />
            </span>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="partnership-website">
                Leave this field empty
              </label>
              <input
                id="partnership-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                ref={honeypot}
              />
            </div>
            <fieldset>
              <legend className="partnership-legend">
                <span className="partnership-number">01</span>A little about you
              </legend>

              <div className="partnership-fields">
                {contactFields.map((field) => {
                  const id = `partnership-${field.name}`;
                  const error = errors[field.name];

                  return (
                    <Field
                      key={field.name}
                      id={id}
                      label={field.label}
                      error={error}
                    >
                      <input
                        id={id}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        aria-required="true"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-error` : undefined}
                        {...register(field.name, {
                          required: `${field.label} is required.`,
                          maxLength: {
                            value: 150,
                            message: "Please use no more than 150 characters.",
                          },
                          validate: (value) =>
                            Boolean(value.trim()) ||
                            `${field.label} is required.`,
                          ...(field.name === "email"
                            ? {
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Enter a valid email address.",
                                },
                              }
                            : {}),
                        })}
                      />
                    </Field>
                  );
                })}

                <fieldset className="partnership-gender">
                  <legend>
                    Gender <span>(optional)</span>
                  </legend>

                  <div className="partnership-check-row">
                    {[
                      ["male", "Male"],
                      ["female", "Female"],
                      ["prefer-not-to-say", "Prefer not to say"],
                    ].map(([value, label]) => (
                      <label className="partnership-check" key={value}>
                        <input
                          type="radio"
                          value={value}
                          {...register("gender")}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <p className="partnership-hint">
                Contact and country fields are required. Gender is optional.
              </p>
            </fieldset>

            <div className="partnership-separator" />

            <fieldset>
              <legend className="partnership-legend">
                <span className="partnership-number">02</span>
                How you would like to help
              </legend>

              <p className="partnership-hint" aria-live="polite">
                {selectedAreaLabels.length
                  ? `Your selected areas: ${selectedAreaLabels.join(" + ")}`
                  : "Choose a partnership area above to begin."}
              </p>

              <fieldset
                id="orphanage-support-fields"
                className="partnership-support-group"
                disabled={!orphanageSelected}
              >
                <legend>Orphanage homes</legend>

                <p>
                  {orphanageSelected
                    ? "Education, healthcare and supplies for monthly visits."
                    : "Select Orphanage homes above to add this support."}
                </p>

                <div className="partnership-check-row">
                  {["School fees", "Stationery"].map((item) => (
                    <label className="partnership-check" key={item}>
                      <input
                        type="checkbox"
                        value={item}
                        {...register("orphanageEducation")}
                      />
                      {item}
                    </label>
                  ))}
                </div>

                <Field
                  id="partnership-healthcare"
                  label="Primary healthcare & medicines"
                  error={errors.healthcare}
                >
                  <textarea
                    id="partnership-healthcare"
                    rows={3}
                    placeholder="Describe the healthcare support you would like to offer"
                    aria-invalid={Boolean(errors.healthcare)}
                    aria-describedby={
                      errors.healthcare
                        ? "partnership-healthcare-error"
                        : undefined
                    }
                    {...register("healthcare", {
                      maxLength: {
                        value: 1500,
                        message: "Please use no more than 1,500 characters.",
                      },
                    })}
                  />
                </Field>

                <p className="partnership-sub-label">
                  Monthly visitation supplies
                </p>

                <div className="partnership-food-grid">
                  {[...foodSupplies, "Clothes"].map((item) => (
                    <label className="partnership-check" key={item}>
                      <input
                        type="checkbox"
                        value={item}
                        {...register("orphanageSupplies")}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset
                id="widow-support-fields"
                className="partnership-support-group"
                disabled={!widowsSelected}
              >
                <legend>Widow empowerment</legend>

                <p>
                  {widowsSelected
                    ? "Practical support for livelihoods and everyday needs."
                    : "Select Widow empowerment above to add this support."}
                </p>

                <div className="partnership-check-row">
                  {[
                    "Career / business empowerment",
                    "Rent / accommodation",
                  ].map((item) => (
                    <label className="partnership-check" key={item}>
                      <input
                        type="checkbox"
                        value={item}
                        {...register("widowSupport")}
                      />
                      {item}
                    </label>
                  ))}
                </div>

                <p className="partnership-sub-label">Food supplies</p>

                <div className="partnership-food-grid">
                  {foodSupplies.map((item) => (
                    <label className="partnership-check" key={item}>
                      <input
                        type="checkbox"
                        value={item}
                        {...register("widowSupplies")}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>
            </fieldset>

            <div className="partnership-form-bottom">
              <p>
                Review your choices before sending your partnership enquiry.
              </p>

              <button type="submit" className="partnership-button">
                Review partnership
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="partnership-review-heading"
        aria-busy={isSending}
        onCancel={(event) => {
          if (sending.current) event.preventDefault();
        }}
        onClose={() => setReview(null)}
        className="partnership-review-dialog"
      >
        {review && (
          <>
            <div className="partnership-review-header">
              <h2 id="partnership-review-heading">Review your partnership</h2>

              <button
                type="button"
                aria-label="Close partnership review"
                disabled={isSending}
                className="partnership-close-button"
                onClick={() => dialogRef.current?.close()}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <dl className="partnership-review-details">
              <div>
                <dt>Name</dt>
                <dd>
                  {review.values.firstName} {review.values.lastName}
                </dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{review.values.email}</dd>
              </div>

              <div>
                <dt>Mobile number</dt>
                <dd>{review.values.phone}</dd>
              </div>

              <div>
                <dt>Country of origin</dt>
                <dd>{review.values.countryOfOrigin}</dd>
              </div>

              <div>
                <dt>Country of residence</dt>
                <dd>{review.values.countryOfResidence}</dd>
              </div>
            </dl>

            {review.areas.includes("orphanage") && (
              <section className="partnership-review-support">
                <h3>Orphanage homes</h3>

                <p>
                  {[
                    ...(review.values.orphanageEducation ?? []),
                    ...(review.values.orphanageSupplies ?? []),
                  ].join(", ") || "Support details to be discussed."}
                </p>

                {review.values.healthcare?.trim() && (
                  <p>Healthcare: {review.values.healthcare}</p>
                )}
              </section>
            )}

            {review.areas.includes("widows") && (
              <section className="partnership-review-support">
                <h3>Widow empowerment</h3>

                <p>
                  {[
                    ...(review.values.widowSupport ?? []),
                    ...(review.values.widowSupplies ?? []),
                  ].join(", ") || "Support details to be discussed."}
                </p>
              </section>
            )}

            <p className="partnership-review-notice">
              Review the details above, then submit your enquiry to our team.
            </p>
            {submitError && (
              <p
                role="alert"
                className="my-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}
            <button
              type="button"
              className="partnership-button"
              disabled={isSending}
              onClick={submitPartnership}
            >
              {isSending ? "Submitting…" : "Submit partnership enquiry"}
              {isSending ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight size={17} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              disabled={isSending}
              className="mt-3 min-h-11 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-60"
              onClick={() => dialogRef.current?.close()}
            >
              Back to form
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
