"use client";

import { useFormStepFocus } from "@/lib/use-form-step-focus";

import { Reveal } from "@/components/animation/HomepageMotion";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Gift, Heart, LoaderCircle } from "lucide-react";
import ShareForm from "@/components/ui/ShareForm";
import {
  defaultDonateContent,
  type DonationFormIntro,
} from "../data/donate-content";
import { donationCauses } from "@/features/get-involved/data/donation-options";
import {
  getCheckoutAttempt,
  rememberCheckoutReference,
} from "../data/checkout-storage";

type DonorDetails = {
  name: string;
  email: string;
};

type GiftReview = DonorDetails & {
  amount: number;
  cause: string;
};

const suggestedAmounts = [5000, 10000, 25000];

// Keep the editable decimal string intact; commas are only for display.
function formatCustomAmount(value: string) {
  if (!/^\d*(\.\d*)?$/.test(value)) return value;
  const [whole, fraction] = value.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

const causes = donationCauses.map((cause) => cause.label);

type DonationCauseLabel = (typeof donationCauses)[number]["label"];

type DonationFormProps = {
  intro?: DonationFormIntro;
  initialAmount?: number;
  initialCause?: DonationCauseLabel;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

const inputClass =
  "min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-base text-foreground transition placeholder:text-slate-400 focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function DonationForm({
  intro = defaultDonateContent.formIntro,
  initialAmount = 10000,
  initialCause = donationCauses[0].label,
}: DonationFormProps) {
  const isSuggestedAmount = suggestedAmounts.includes(initialAmount);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    isSuggestedAmount ? initialAmount : null,
  );

  const [customAmount, setCustomAmount] = useState(
    isSuggestedAmount ? "" : String(initialAmount),
  );

  const [cause, setCause] = useState<string>(initialCause);
  const [amountError, setAmountError] = useState("");
  const [review, setReview] = useState<GiftReview | null>(null);
  const reviewRef = useFormStepFocus<HTMLHeadingElement>(review);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const checkoutBusy = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorDetails>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const amount = selectedAmount ?? Number(customAmount);

  const amountIsValid =
    Number.isFinite(amount) &&
    amount > 0 &&
    (selectedAmount !== null || /^\d+(\.\d{1,2})?$/.test(customAmount.trim()));

  function chooseAmount(value: number) {
    setSelectedAmount(value);
    setCustomAmount("");
    setAmountError("");
    setReview(null);
  }

  function changeCustomAmount(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const displayed = input.value;
    const selection = input.selectionStart ?? displayed.length;
    let position = displayed.slice(0, selection).replace(/,/g, "").length;
    let value = displayed.replace(/,/g, "");

    // Deleting a separator should delete the adjacent digit, not reinsert
    // the comma and leave the visitor stuck at the same position.
    const inputType = (event.nativeEvent as InputEvent).inputType;
    if (value === customAmount && inputType === "deleteContentBackward" && position > 0) {
      value = value.slice(0, position - 1) + value.slice(position);
      position -= 1;
    } else if (value === customAmount && inputType === "deleteContentForward") {
      value = value.slice(0, position) + value.slice(position + 1);
    }

    setCustomAmount(value);
    setSelectedAmount(null);
    setAmountError("");
    setReview(null);

    const formatted = formatCustomAmount(value);
    let caret = 0;
    let characters = 0;
    while (caret < formatted.length && characters < position) {
      if (formatted[caret] !== ",") characters += 1;
      caret += 1;
    }
    // Restore the caret after React renders the formatted controlled value.
    requestAnimationFrame(() => {
      if (document.activeElement === input && input.value === formatted) {
        input.setSelectionRange(caret, caret);
      }
    });
  }

  function reviewGift(details: DonorDetails) {
    if (!amountIsValid) {
      setAmountError(
        "Enter an amount greater than zero, with up to two decimal places.",
      );
      return;
    }

    setAmountError("");

    setReview({
      name: details.name.trim(),
      email: details.email.trim(),
      amount,
      cause,
    });
  }

  async function startCheckout() {
    if (!review || checkoutBusy.current) return;

    const selectedCause = donationCauses.find(
      (option) => option.label === review.cause,
    );

    if (!selectedCause) {
      setCheckoutError("Please select a valid donation cause.");
      return;
    }

    const donationDetails = {
      name: review.name.trim(),
      email: review.email,
      amount: review.amount,
      cause: selectedCause.value,
    };

    const details = JSON.stringify(donationDetails);

    checkoutBusy.current = true;
    setIsRedirecting(true);
    setCheckoutError("");

    try {
      const checkoutAttempt = await getCheckoutAttempt(details);
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...donationDetails,
          requestId: checkoutAttempt.requestId,
        }),
        signal: AbortSignal.timeout(25000),
      });

      const result = await response.json();

      if (typeof result?.reference === "string") {
        rememberCheckoutReference(result.reference, checkoutAttempt.storageKey);
      }

      // If this donation is already paid, show its verified result.
      if (
        response.status === 409 &&
        result?.code === "ALREADY_PAID" &&
        typeof result?.reference === "string"
      ) {
        // Reload intentionally clears busy checkout state before showing a paid result.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(
          "/get-involved/donate?reference=" +
            encodeURIComponent(result.reference),
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "We couldn't start checkout. Please try again.",
        );
      }

      if (typeof result?.authorizationUrl !== "string") {
        throw new Error("Checkout address was missing. Please try again.");
      }

      const checkoutUrl = new URL(result.authorizationUrl);

      if (
        checkoutUrl.protocol !== "https:" ||
        checkoutUrl.hostname !== "checkout.paystack.com"
      ) {
        throw new Error("The checkout address was invalid.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      setCheckoutError(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Checkout could not be reached. Please retry with the same details.",
      );

      checkoutBusy.current = false;
      setIsRedirecting(false);
    }
  }

  return (
    <section
      id="donation-form"
      aria-labelledby="donation-form-heading"
      className="scroll-mt-28 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(19,44,64,0.04)] sm:p-7"
    >
      <Reveal as="header" className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="donation-form-heading"
            className="font-serif text-3xl leading-tight font-bold tracking-tight"
          >
            {intro.heading}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {intro.description}
          </p>
        </div>

        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary">
          <Heart size={22} aria-hidden="true" />
        </span>
      </Reveal>

      <div className="mt-5  inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-primary">
        <Gift size={15} aria-hidden="true" />
        One-time donation · NGN
      </div>
      <span className="md:ml-4">
        <ShareForm
          title="Support Beloved Kindness Maxcare"
          path="/get-involved/donate#donation-form"
        />
      </span>

      <form
        noValidate
        onSubmit={handleSubmit(reviewGift)}
        onChange={() => setReview(null)}
        className="mt-5"
      >
        <fieldset
          disabled={isRedirecting}
          aria-label="Donation details"
          className="min-w-0"
        >
          <legend className="mb-3 text-sm font-semibold">
            Choose your amount
          </legend>

          <div className="grid grid-cols-3 gap-2">
            {suggestedAmounts.map((value) => {
              const isSelected = selectedAmount === value;

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => chooseAmount(value)}
                  className={`min-h-12 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors sm:text-sm ${
                    isSelected
                      ? "border-primary bg-blue-50 text-primary ring-1 ring-primary"
                      : "border-slate-200 bg-white hover:border-primary"
                  }`}
                >
                  {formatAmount(value)}
                </button>
              );
            })}
          </div>

          <label htmlFor="donation-custom-amount" className="sr-only">
            Custom donation amount in naira
          </label>

          <div
            className={`mt-3 flex min-h-12 items-stretch overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] focus-within:ring-2 ${
              amountError
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-100"
                : "border-slate-200 focus-within:border-primary focus-within:ring-primary/15"
            }`}
          >
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 px-4 text-base font-semibold text-foreground"
            >
              ₦
            </span>

            <input
              id="donation-custom-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={formatCustomAmount(customAmount)}
              onChange={changeCustomAmount}
              placeholder="Enter another amount"
              aria-invalid={Boolean(amountError)}
              aria-describedby={
                amountError ? "donation-amount-error" : undefined
              }
              className="min-h-12 w-full min-w-0 border-0 bg-transparent px-4 py-3 text-base leading-6 text-foreground outline-none placeholder:text-slate-400 focus:ring-0 focus-visible:outline-none"
            />
          </div>

          {amountError && (
            <p
              id="donation-amount-error"
              role="alert"
              className="mt-2 text-xs leading-5 text-red-600"
            >
              {amountError}
            </p>
          )}
        </fieldset>

        <div className="mt-5">
          <label
            htmlFor="donation-cause"
            className="mb-2 block text-sm font-semibold"
          >
            Where would you like to help?
          </label>

          <select
            id="donation-cause"
            value={cause}
            onChange={(event) => {
              setCause(event.target.value);
              setReview(null);
            }}
            className={inputClass}
          >
            {causes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="my-6 h-px bg-slate-200" />

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="donation-name"
              className="mb-2 block text-sm font-semibold"
            >
              Your name{" "}
              <span className="text-xs font-normal text-muted">(optional)</span>
            </label>

            <input
              id="donation-name"
              autoComplete="name"
              placeholder="Your full name"
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "donation-name-error" : undefined}
              {...register("name", {
                maxLength: {
                  value: 120,
                  message: "Please keep your name under 120 characters.",
                },
              })}
            />

            {errors.name && (
              <p id="donation-name-error" className="mt-2 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="min-w-0">
            <label
              htmlFor="donation-email"
              className="mb-2 block text-sm font-semibold"
            >
              Email address
            </label>

            <input
              id="donation-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "donation-email-error" : undefined
              }
              {...register("email", {
                required: "Please enter your email address.",
                validate: (value) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
                  "Please enter a valid email address.",
              })}
            />

            {errors.email && (
              <p
                id="donation-email-error"
                className="mt-2 text-xs text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div
          aria-live="polite"
          className="mt-6 flex items-center justify-between gap-4"
        >
          <span className="text-sm text-muted">Your one-time gift</span>

          <strong className="text-2xl font-bold tracking-tight">
            {amountIsValid ? formatAmount(amount) : "—"}
          </strong>
        </div>

        <button
          type="submit"
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_0_#1643b9] transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {amountIsValid ? `Continue with ${formatAmount(amount)}` : "Continue"}

          <ArrowRight size={18} aria-hidden="true" />
        </button>

        <p className="mt-4 text-center text-xs leading-6 text-muted">
          A small act of kindness can be the beginning of something bigger.
        </p>
      </form>

      {review && (
        <section
          aria-labelledby="gift-summary-heading"
          aria-busy={isRedirecting}
          className="mt-5 rounded-xl bg-blue-50 p-4 sm:p-5"
        >
          <h3 id="gift-summary-heading" ref={reviewRef} tabIndex={-1} className="scroll-mt-32 text-sm font-bold">
            Your gift summary
          </h3>

          <p className="mt-2 text-sm leading-6">
            {formatAmount(review.amount)} · One-time gift
          </p>

          <p className="mt-1 text-sm leading-6">{review.cause}</p>

          <p className="mt-1 break-all text-sm leading-6 text-muted">
            {review.email}
          </p>

          <p className="mt-3 text-xs leading-6 text-muted">
            Test mode: checkout uses simulated payments. No real money is
            charged.
          </p>

          {checkoutError && (
            <p role="alert" className="mt-3 text-sm leading-6 text-red-700">
              {checkoutError}
            </p>
          )}

          <button
            type="button"
            onClick={startCheckout}
            disabled={isRedirecting}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
          >
            {isRedirecting ? (
              <>
                <LoaderCircle
                  size={18}
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                />
                Opening checkout…
              </>
            ) : (
              <>
                Pay with Paystack
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </section>
      )}
    </section>
  );
}
