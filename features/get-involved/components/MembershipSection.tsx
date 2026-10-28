"use client";

import { Reveal } from "@/components/animation/HomepageMotion";
import Image from "next/image";
import {
  defaultMembershipContent,
  type MembershipContent,
} from "../data/membership-content";
import { useId, useRef, useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import ShareForm from "@/components/ui/ShareForm";
import {
  ArrowRight,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Quote,
  Sprout,
  UsersRound,
} from "lucide-react";

import { submitEnquiry } from "../data/submit-enquiry";

export type MembershipApplicationValues = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  countryOfOrigin: string;
  stateOfOrigin: string;
  countryOfResidence: string;
  stateOfResidence: string;
  employmentStatus: string;
  referralSource: string;
  motivation: string;
  consent: boolean;
};

type MembershipSectionProps = {
  content?: MembershipContent;
  onSubmitApplication?: (data: MembershipApplicationValues) => Promise<void>;
};

type FormFieldProps = {
  id: string;
  label: string;
  error?: FieldError;
  optional?: boolean;
  children: ReactNode;
};

const benefitStyles = [
  { icon: Heart, color: "bg-blue-100 text-blue-600" },
  { icon: UsersRound, color: "bg-amber-100 text-amber-600" },
  { icon: Sprout, color: "bg-green-100 text-green-600" },
];

const locationFields = [
  {
    name: "countryOfOrigin",
    label: "Country of origin",
    placeholder: "e.g. Nigeria",
  },
  {
    name: "stateOfOrigin",
    label: "State of origin",
    placeholder: "Your state / region",
  },
  {
    name: "countryOfResidence",
    label: "Country of residence",
    placeholder: "Where you live now",
  },
  {
    name: "stateOfResidence",
    label: "State of residence",
    placeholder: "Your current state / region",
  },
] as const;

const selectFields = [
  {
    name: "employmentStatus",
    label: "Employment status",
    options: [
      "Employed",
      "Self-employed",
      "Student",
      "Unemployed",
      "Retired",
      "Prefer not to say",
    ],
  },
  {
    name: "referralSource",
    label: "How did you hear about us?",
    options: [
      "Social media",
      "Friend or family",
      "Our website",
      "Community outreach",
      "Church or organization",
      "Other",
    ],
  },
] as const;

const reviewFields = [
  { name: "fullName", label: "Full name" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "gender", label: "Gender" },
  ...locationFields,
  { name: "employmentStatus", label: "Employment status" },
  { name: "referralSource", label: "How you heard about us" },
  { name: "motivation", label: "Why you would like to join" },
] as const;

const inputClass =
  "min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-base text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 aria-[invalid=true]:border-red-500 lg:text-sm";

const buttonClass =
  "flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60";

function FormField({
  id,
  label,
  error,
  optional = false,
  children,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-[#102452]"
      >
        {label}{" "}
        {optional ? (
          <span className="font-normal text-slate-500">(Optional)</span>
        ) : (
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

function FormGroup({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-5 flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-primary">
          {number}
        </span>

        <span className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </span>
      </legend>

      {children}
    </fieldset>
  );
}

export default function MembershipSection({
  content = defaultMembershipContent,
  onSubmitApplication,
}: MembershipSectionProps = {}) {
  const formId = useId();
  const submissionId = useRef<string | null>(null);
  const sending = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const [review, setReview] = useState<MembershipApplicationValues | null>(
    null,
  );
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<MembershipApplicationValues>({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      countryOfOrigin: "",
      stateOfOrigin: "",
      countryOfResidence: "",
      stateOfResidence: "",
      employmentStatus: "",
      referralSource: "",
      motivation: "",
      consent: false,
    },
  });

  function fieldId(name: keyof MembershipApplicationValues) {
    return `${formId}-${name}`;
  }

  function fieldA11y(name: keyof MembershipApplicationValues) {
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${fieldId(name)}-error` : undefined,
    };
  }

  function reviewApplication(data: MembershipApplicationValues) {
    submissionId.current = crypto.randomUUID();
    setSubmitError("");
    setSubmitted(false);
    setReview(data);
  }

  function editApplication() {
    setReview(null);
    setSubmitError("");

    // The input must become visible before we move focus to it.
    requestAnimationFrame(() => setFocus("fullName"));
  }

  async function submitApplication() {
    if (!review || sending.current) return;
    sending.current = true;
    setSubmitError("");
    setIsSending(true);
    try {
      if (onSubmitApplication) {
        await onSubmitApplication(review);
      } else {
        submissionId.current ??= crypto.randomUUID();
        await submitEnquiry(
          "membership",
          review,
          submissionId.current,
          honeypot.current?.value ?? "",
        );
      }
      reset();
      if (honeypot.current) honeypot.current.value = "";
      setReview(null);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't submit your application. Please try again.",
      );
    } finally {
      sending.current = false;
      setIsSending(false);
    }
  }

  return (
    <section
      id="join-us"
      aria-labelledby={`${formId}-heading`}
      className="scroll-mt-28 bg-transparent py-14 font-sans sm:py-16"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-6">
          {/* Introduction: photo background on desktop. */}
          <Reveal
            as="aside"
            className="relative isolate min-w-0 lg:overflow-hidden lg:rounded-[2rem] lg:bg-[#1a4276]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 hidden lg:block"
            >
              <Image
                src={content.image}
                unoptimized={content.image.startsWith("https://cdn.sanity.io/")}
                alt=""
                fill
                sizes="(min-width: 1120px) 450px, 45vw"
                className="object-cover object-[65%_center]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(8,25,49,0.90),rgba(18,54,98,0.80))]" />
            </div>

            <div className="lg:p-8 xl:p-10">
              <p className="text-xs font-bold tracking-[0.18em] text-amber-600 uppercase lg:text-amber-300">
                {content.label}
              </p>

              <h2
                id={`${formId}-heading`}
                className="mt-5 max-w-md text-4xl leading-[1.08] font-extrabold tracking-tight text-[#0b1742] sm:text-5xl lg:text-4xl lg:text-white"
              >
                {content.headingFirstLine}
                <br />
                {content.headingSecondLine}{" "}
                <span className="text-primary lg:text-blue-300">
                  {content.headingHighlight}
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 lg:text-slate-200">
                {content.description}
              </p>

              <ul className="mt-8 space-y-6">
                {content.benefits.map(({ id, title, description }, index) => {
                  const { icon: Icon, color } = benefitStyles[index];
                  return (
                    <li key={id} className="flex items-start gap-4">
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}
                      >
                        <Icon size={22} aria-hidden="true" />
                      </span>

                      <div>
                        <h3 className="text-sm font-bold text-[#123568] lg:text-white">
                          {title}
                        </h3>

                        <p className="mt-1 text-xs leading-6 text-slate-600 lg:text-slate-200">
                          {description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <figure className="mt-8 flex items-start gap-3 rounded-2xl bg-[#f3ebe2] p-5 lg:bg-white/10">
                <Quote
                  size={24}
                  className="shrink-0 text-amber-600 lg:text-amber-300"
                  aria-hidden="true"
                />

                <blockquote className="text-sm leading-7 text-[#183661] lg:text-white">
                  “{content.quote}”
                </blockquote>
              </figure>
            </div>
          </Reveal>

          {/* Photo and form share one wrapper to control the overlap. */}
          <div className="min-w-0">
            <Reveal
              as="div"
              image
              className="relative h-80 overflow-hidden rounded-t-[2rem] sm:h-[420px] lg:hidden"
            >
              <Image
                src={content.image}
                unoptimized={content.image.startsWith("https://cdn.sanity.io/")}
                alt={content.imageAlt}
                fill
                sizes="(min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)"
                className="object-cover object-[65%_center]"
              />
            </Reveal>

            <div className="relative -mt-10 rounded-[1.75rem] bg-white p-5 shadow-[0_16px_60px_-20px_rgba(15,39,71,0.18)] sm:p-7 lg:mt-0 lg:h-full">
              <Reveal as="header" className="mb-7">
                <p className="text-[10px] font-bold tracking-[0.16em] text-primary uppercase">
                  {content.formLabel}
                </p>

                <h3 className="mt-2 text-2xl leading-tight font-extrabold tracking-tight text-[#0b1742]">
                  {content.formHeading}
                </h3>

                <p className="mt-3 text-xs text-slate-500">
                  Fields marked with <span className="text-red-500">*</span> are
                  required.
                </p>
              </Reveal>

              <ShareForm
                title="Volunteer with Beloved Kindness Maxcare"
                path="/get-involved/volunteer#join-us"
              />

              <form
                noValidate
                onSubmit={(event) => {
                  void handleSubmit(reviewApplication)(event);
                }}
                hidden={review !== null}
                className="space-y-7"
              >
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor={formId + "-website"}>
                    Leave this field empty
                  </label>
                  <input
                    id={formId + "-website"}
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    ref={honeypot}
                  />
                </div>
                <FormGroup number="01" title="Your details">
                  <div className="space-y-4">
                    <FormField
                      id={fieldId("fullName")}
                      label="Full name"
                      error={errors.fullName}
                    >
                      <input
                        id={fieldId("fullName")}
                        autoComplete="name"
                        placeholder="Your full name"
                        className={inputClass}
                        {...register("fullName", {
                          required: "Please enter your full name.",
                          validate: (value) =>
                            value.trim().length >= 2 ||
                            "Please enter at least 2 characters.",
                        })}
                        {...fieldA11y("fullName")}
                      />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        id={fieldId("email")}
                        label="Email address"
                        error={errors.email}
                      >
                        <input
                          id={fieldId("email")}
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={inputClass}
                          {...register("email", {
                            required: "Please enter your email.",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address.",
                            },
                          })}
                          {...fieldA11y("email")}
                        />
                      </FormField>

                      <FormField
                        id={fieldId("phone")}
                        label="Phone number"
                        error={errors.phone}
                      >
                        <input
                          id={fieldId("phone")}
                          type="tel"
                          autoComplete="tel"
                          placeholder="Include country code"
                          className={inputClass}
                          {...register("phone", {
                            required: "Please enter your phone number.",
                            validate: (value) => {
                              const digits = value.replace(/\D/g, "");

                              return (
                                (/^\+?[\d\s().-]+$/.test(value) &&
                                  digits.length >= 7 &&
                                  digits.length <= 15) ||
                                "Enter a valid phone number."
                              );
                            },
                          })}
                          {...fieldA11y("phone")}
                        />
                      </FormField>
                    </div>

                    <FormField
                      id={fieldId("gender")}
                      label="Gender"
                      error={errors.gender}
                    >
                      <select
                        id={fieldId("gender")}
                        className={inputClass}
                        {...register("gender", {
                          required: "Please select an option.",
                        })}
                        {...fieldA11y("gender")}
                      >
                        <option value="">Select an option</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Prefer not to say</option>
                      </select>
                    </FormField>
                  </div>
                </FormGroup>

                <div className="h-px bg-slate-200" />

                <FormGroup number="02" title="Where you are from">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {locationFields.map(({ name, label, placeholder }) => (
                      <FormField
                        key={name}
                        id={fieldId(name)}
                        label={label}
                        error={errors[name]}
                      >
                        <input
                          id={fieldId(name)}
                          placeholder={placeholder}
                          className={inputClass}
                          {...register(name, {
                            required: `Please enter your ${label.toLowerCase()}.`,
                            validate: (value) =>
                              Boolean(value.trim()) ||
                              "This field is required.",
                          })}
                          {...fieldA11y(name)}
                        />
                      </FormField>
                    ))}
                  </div>
                </FormGroup>

                <div className="h-px bg-slate-200" />

                <FormGroup number="03" title="Your story">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectFields.map(({ name, label, options }) => (
                      <FormField
                        key={name}
                        id={fieldId(name)}
                        label={label}
                        error={errors[name]}
                      >
                        <select
                          id={fieldId(name)}
                          className={inputClass}
                          {...register(name, {
                            required: "Please select an option.",
                          })}
                          {...fieldA11y(name)}
                        >
                          <option value="">Select an option</option>

                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    ))}
                  </div>

                  <div className="mt-4">
                    <FormField
                      id={fieldId("motivation")}
                      label="Why would you like to join?"
                      error={errors.motivation}
                      optional
                    >
                      <textarea
                        id={fieldId("motivation")}
                        rows={4}
                        placeholder="Tell us what inspires you, and the skills or experience you would like to share."
                        className={`${inputClass} resize-y`}
                        {...register("motivation", {
                          maxLength: {
                            value: 2000,
                            message:
                              "Please keep your response under 2,000 characters.",
                          },
                        })}
                        {...fieldA11y("motivation")}
                      />
                    </FormField>
                  </div>
                </FormGroup>

                <div>
                  <label className="flex items-start gap-3 text-xs leading-6 text-slate-600">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 shrink-0 accent-blue-600"
                      {...register("consent", {
                        required: "Please agree before continuing.",
                      })}
                      {...fieldA11y("consent")}
                    />

                    <span>
                      I agree that Beloved Kindness Maxcare may use the
                      information provided to contact me regarding membership
                      and volunteering opportunities.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>

                  {errors.consent && (
                    <p
                      id={`${fieldId("consent")}-error`}
                      className="mt-2 text-xs text-red-600"
                    >
                      {errors.consent.message}
                    </p>
                  )}
                </div>

                <div>
                  <button type="submit" className={buttonClass}>
                    Review application
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>

                  <p className="mt-3 text-center text-xs text-slate-500">
                    Take a moment to check your details before sending.
                  </p>
                </div>
              </form>

              {review && (
                <section aria-label="Application review">
                  <h4 className="text-lg font-bold text-foreground">
                    Review your application
                  </h4>

                  <dl className="mt-5 space-y-4">
                    {reviewFields.map(({ name, label }) => (
                      <div key={name}>
                        <dt className="text-xs text-slate-500">{label}</dt>
                        <dd className="mt-1 text-sm wrap-anywhere text-foreground">
                          {review[name] || "Not provided"}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-5 text-xs leading-6 text-slate-600">
                    You agreed to be contacted about membership and volunteering
                    opportunities.
                  </p>

                  <div className="mt-6 space-y-3">
                    <button
                      type="button"
                      disabled={isSending}
                      onClick={submitApplication}
                      className={buttonClass}
                    >
                      {isSending ? (
                        <>
                          Submitting…
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                        </>
                      ) : (
                        <>
                          Submit application
                          <ArrowRight size={17} aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSending}
                      onClick={editApplication}
                      className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-60"
                    >
                      Edit my details
                    </button>
                  </div>
                </section>
              )}

              {submitError && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700"
                >
                  {submitError}
                </p>
              )}

              {submitted && (
                <p
                  role="status"
                  className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800"
                >
                  Thank you! Your application has been submitted.
                </p>
              )}

              <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-6 text-slate-500">
                <LockKeyhole
                  size={14}
                  className="mt-1 shrink-0"
                  aria-hidden="true"
                />
                Your information will only be used for membership and
                volunteering communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
