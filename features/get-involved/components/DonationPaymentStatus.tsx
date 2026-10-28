"use client";

import { useEffect, useState } from "react";
import { clearCheckoutAttempt } from "../data/checkout-storage";

type PaymentState = {
  status:
    | "checking"
    | "success"
    | "failed"
    | "abandoned"
    | "reversed"
    | "unconfirmed"
    | "error";
  message: string;
};

export default function DonationPaymentStatus({
  reference,
  checkoutCancelled = false,
}: {
  reference: string;
  checkoutCancelled?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);

  const [payment, setPayment] = useState<PaymentState>({
    status: "checking",
    message: "Please wait while we confirm your payment.",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function verifyPayment() {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof result?.error === "string"
              ? result.error
              : "We couldn't check your payment. Please try again.",
          );
        }

        if (controller.signal.aborted) return;

        if (result?.verified === true && result?.status === "successful") {
          clearCheckoutAttempt(reference);

          setPayment({
            status: "success",
            message:
              "Your test donation has been confirmed. No real money was charged.",
          });
        } else if (result?.status === "failed") {
          setPayment({
            status: "failed",
            message:
              "Paystack reported that this payment was unsuccessful. If your bank shows a debit, keep this reference and contact us before paying again.",
          });
        } else if (result?.status === "abandoned") {
          setPayment({
            status: "abandoned",
            message:
              "Paystack reports that checkout was not completed. No successful donation has been confirmed for this reference.",
          });
        } else if (result?.status === "reversed") {
          setPayment({
            status: "reversed",
            message:
              "Paystack reports that this payment was reversed. Keep this reference if you need help.",
          });
        } else {
          setPayment({
            status: "unconfirmed",
            message:
              "Your payment has not been confirmed yet. Please check again before starting another payment.",
          });
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setPayment({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "We couldn't check your payment. Please try again.",
        });
      }
    }

    void verifyPayment();

    return () => controller.abort();
  }, [reference, attempt]);

  const headings = {
    checking: "Checking your payment…",
    success: "Test donation confirmed",
    failed: "Payment unsuccessful",
    abandoned: "Checkout not completed",
    reversed: "Payment reversed",
    unconfirmed: "Payment not yet confirmed",
    error: "Unable to confirm payment",
  };

  const canRetry =
    payment.status !== "checking" && payment.status !== "success";

  return (
    <section
      aria-label="Donation payment result"
      aria-busy={payment.status === "checking"}
      className={`mb-8 rounded-2xl border p-5 sm:p-6 ${
        payment.status === "success"
          ? "border-emerald-200 bg-emerald-50"
          : "border-blue-200 bg-blue-50"
      }`}
    >
      {checkoutCancelled && payment.status !== "success" && (
        <p className="mb-3 text-sm font-medium text-slate-700">
          You returned from checkout. Please check the payment result below
          before starting another donation.
        </p>
      )}
      <div role="status" aria-live="polite" aria-atomic="true">
        <h2 className="font-serif text-2xl font-bold text-slate-950">
          {headings[payment.status]}
        </h2>

        <p className="mt-2 text-sm leading-7 text-slate-700">
          {payment.message}
        </p>
      </div>

      <p className="mt-3 break-all text-xs text-slate-600">
        Reference: {reference}
      </p>

      {canRetry && (
        <button
          type="button"
          onClick={() => {
            setPayment({
              status: "checking",
              message: "Please wait while we confirm your payment.",
            });
            setAttempt((value) => value + 1);
          }}
          className="mt-4 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Check payment again
        </button>
      )}
    </section>
  );
}
