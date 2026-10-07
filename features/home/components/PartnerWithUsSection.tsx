"use client";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import {
  ArrowRight,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Quote,
  Sprout,
  UsersRound,
  FilePenLine,
} from "lucide-react";

const JoinUs = "/images/partners/JoinUs.png";

type MembershipApplicationValues = {
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

type PartnerWithUsSectionProps = {
  onSubmitApplication?: (data: MembershipApplicationValues) => Promise<void>;
};

type FormFieldProps = {
  id: string;
  label: string;
  error?: FieldError;
  optional?: boolean;
  children: ReactNode;
};

const benefits = [
  {
    title: "Serve with compassion",
    description: "Support initiatives created to restore hope and dignity.",
    icon: Heart,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Connect with community",
    description: "Work with like-minded individuals and organizations.",
    icon: UsersRound,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Create real impact",
    description: "Use your skills and resources to transform lives.",
    icon: Sprout,
    color: "bg-green-100 text-green-600",
  },
];

const employmentOptions = [
  "Employed",
  "Self-employed",
  "Student",
  "Unemployed",
  "Retired",
  "Prefer not to say",
];

const referralOptions = [
  "Social media",
  "Friend or family",
  "Our website",
  "Community outreach",
  "Church or organization",
  "Other",
];

const locationFields = [
  {
    name: "countryOfOrigin",
    label: "Country of Origin",
    placeholder: "e.g. Nigeria",
  },
  {
    name: "stateOfOrigin",
    label: "State of Origin",
    placeholder: "State / region",
  },
  {
    name: "countryOfResidence",
    label: "Country of Residence",
    placeholder: "e.g. Nigeria",
  },
  {
    name: "stateOfResidence",
    label: "State of Residence",
    placeholder: "State / region",
  },
] as const;

const inputClass =
  "min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400";

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
          <span className="text-red-500" aria-hidden="true">
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

function PartnerWithUsSection({
  onSubmitApplication,
}: PartnerWithUsSectionProps = {}) {
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const fieldA11y = (name: keyof MembershipApplicationValues) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  async function onSubmit(data: MembershipApplicationValues) {
    setSubmitError("");
    setSubmitted(false);

    if (!onSubmitApplication) {
      setSubmitError(
        "The application form is not connected yet. Please try again later.",
      );
      return;
    }

    try {
      await onSubmitApplication(data);
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError("We couldn't submit your application. Please try again.");
    }
  }

  return (
    <section
      id="join-us"
      aria-labelledby="join-us-heading"
      className="relative isolate overflow-hidden bg-transparent py-14 font-sans sm:py-16 lg:py-6"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-blue-100/60 blur-2xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -right-28 -z-10 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
      />

      <div className="px-5 sm:px-8 lg:mx-auto lg:max-w-[1440px] lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Left: introduction with desktop background photo */}
          <div className="relative isolate order-1 min-w-0 lg:flex lg:items-center lg:overflow-hidden lg:rounded-[2rem] lg:bg-[#1a4276]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <Image
                src={JoinUs}
                alt=""
                fill
                sizes="(min-width: 1440px) 664px, (min-width: 1024px) calc(50vw - 56px), 100vw"
                loading="lazy"
                className="object-cover object-[65%_center]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,25,49,0.80)_0%,rgba(8,25,49,0.60)_50%,rgba(8,25,49,0.35)_100%)]" />
            </div>

            <div className="relative z-10 w-full lg:p-8 xl:p-12">
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-amber-600 uppercase lg:text-amber-300">
                Get involved
              </p>

              <h2
                id="join-us-heading"
                className="max-w-md text-4xl leading-[1.05] font-extrabold tracking-tight text-[#0B1742] sm:text-5xl lg:text-[clamp(2.25rem,3.2vw,3rem)] lg:text-white"
              >
                Join Beloved
                <br />
                Kindness{" "}
                <span className="text-primary lg:text-blue-300">Maxcare</span>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base lg:text-sm lg:text-slate-200">
                Become part of a community of compassionate people committed to
                restoring hope, dignity and better opportunities for vulnerable
                individuals across Nigeria.
              </p>

              <ul className="mt-7 space-y-5">
                {benefits.map(({ title, description, icon: Icon, color }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}
                    >
                      <Icon size={23} strokeWidth={2} aria-hidden="true" />
                    </span>

                    <div className="pt-0.5">
                      <h3 className="text-sm font-bold text-[#123568] lg:text-white">
                        {title}
                      </h3>

                      <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-xs lg:text-slate-200">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <figure className="mt-8 flex gap-3 rounded-2xl bg-[#F3EBE2] p-5 sm:p-6 lg:bg-white/10 lg:ring-1 lg:ring-white/20 lg:backdrop-blur-sm">
                <Quote
                  className="size-7 shrink-0 fill-amber-400/40 text-amber-500/60 lg:text-amber-300"
                  aria-hidden="true"
                />

                <div>
                  <blockquote className="text-sm leading-relaxed text-[#183661] lg:text-white">
                    “When you give your time and heart, you help build stronger,
                    healthier communities.”
                  </blockquote>

                  <div className="mt-3 h-0.5 w-9 bg-amber-500 lg:bg-amber-300" />
                </div>
              </figure>
            </div>
          </div>

          {/* Mobile photo */}
          <div className="relative order-2 -mb-16 lg:hidden">
            <div className="relative h-[320px] overflow-hidden rounded-t-[2rem] sm:h-[420px]">
              <Image
                src={JoinUs}
                alt="A Beloved Kindness Maxcare volunteer with children"
                fill
                sizes="(min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                loading="lazy"
                className="object-cover object-[65%_center]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent"
              />
            </div>
          </div>

          {/* Right: application form */}
          <div className="relative order-3 min-w-0 rounded-[1.75rem] bg-white p-5 shadow-[0_16px_60px_-20px_rgba(15,39,71,0.18)] sm:p-7 lg:p-6">
            <div className="mb-6 flex items-start gap-3">
              <FilePenLine
                className="text-primary mt-0.5 hidden size-8 shrink-0 lg:block"
                aria-hidden="true"
              />

              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-blue-600 uppercase lg:hidden">
                  Membership application
                </p>

                <h3 className="text-2xl leading-tight font-extrabold tracking-tight text-[#0B1742] lg:text-lg">
                  <span className="lg:hidden">
                    Tell us a little
                    <br />
                    about yourself
                  </span>

                  <span className="hidden lg:inline">
                    Membership Application
                  </span>
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <span className="hidden lg:inline">
                    Tell us a little about yourself.{" "}
                  </span>
                  Fields marked with <span className="text-red-500">*</span> are
                  required.
                </p>
              </div>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                id="fullName"
                label="Full Name"
                error={errors.fullName}
              >
                <input
                  id="fullName"
                  autoComplete="name"
                  placeholder="e.g. Chinedu Okafor"
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

              <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                <FormField
                  id="email"
                  label="Email Address"
                  error={errors.email}
                >
                  <input
                    id="email"
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

                <FormField id="phone" label="Phone Number" error={errors.phone}>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
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

              <fieldset
                aria-describedby={errors.gender ? "gender-error" : undefined}
              >
                <legend className="mb-2 text-xs font-semibold text-[#102452]">
                  Gender <span className="text-red-500">*</span>
                </legend>

                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Prefer not to say"].map((gender) => (
                    <label
                      key={gender}
                      className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-2 text-[11px] leading-tight text-slate-600 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 sm:px-3"
                    >
                      <input
                        type="radio"
                        value={gender}
                        className="size-3.5 shrink-0 accent-blue-600"
                        {...register("gender", {
                          required: "Please select an option.",
                        })}
                        {...fieldA11y("gender")}
                      />

                      {gender}
                    </label>
                  ))}
                </div>

                {errors.gender && (
                  <p id="gender-error" className="mt-1.5 text-xs text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </fieldset>

              <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                {locationFields.map(({ name, label, placeholder }) => (
                  <FormField
                    key={name}
                    id={name}
                    label={label}
                    error={errors[name]}
                  >
                    <input
                      id={name}
                      placeholder={placeholder}
                      className={inputClass}
                      {...register(name, {
                        required: `Please enter your ${label.toLowerCase()}.`,
                        validate: (value) =>
                          Boolean(value.trim()) || "This field is required.",
                      })}
                      {...fieldA11y(name)}
                    />
                  </FormField>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  id="employmentStatus"
                  label="Employment Status"
                  error={errors.employmentStatus}
                >
                  <select
                    id="employmentStatus"
                    className={inputClass}
                    {...register("employmentStatus", {
                      required: "Please select your employment status.",
                    })}
                    {...fieldA11y("employmentStatus")}
                  >
                    <option value="">Select an option</option>

                    {employmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  id="referralSource"
                  label="How did you hear about us?"
                  error={errors.referralSource}
                >
                  <select
                    id="referralSource"
                    className={inputClass}
                    {...register("referralSource", {
                      required: "Please select an option.",
                    })}
                    {...fieldA11y("referralSource")}
                  >
                    <option value="">Select an option</option>

                    {referralOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField
                id="motivation"
                label="Why would you like to join?"
                error={errors.motivation}
                optional
              >
                <textarea
                  id="motivation"
                  rows={3}
                  placeholder="Tell us a little about your interests, skills or how you would like to contribute..."
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

              <div>
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 shrink-0 rounded accent-blue-600"
                    {...register("consent", {
                      required: "Please agree before submitting.",
                    })}
                    {...fieldA11y("consent")}
                  />

                  <span className="text-[11px] leading-relaxed text-[#243B60]">
                    I agree that Beloved Kindness Maxcare may use the
                    information provided to contact me regarding membership and
                    volunteering opportunities.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                {errors.consent && (
                  <p id="consent-error" className="mt-1.5 text-xs text-red-600">
                    {errors.consent.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {submitError}
                </p>
              )}

              {submitted && (
                <p
                  role="status"
                  className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
                >
                  Thank you! Your application has been submitted successfully.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary flex min-h-12 w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    Submitting...
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={17} aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="flex items-start justify-center gap-2 text-center text-[10px] leading-relaxed text-slate-500">
                <LockKeyhole
                  size={13}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Your information will only be used for membership and
                volunteering communication.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerWithUsSection;
