"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) return;

    const formData = new FormData(event.currentTarget);

    setError("");
    setIsPending(true);

    try {
      const result = await authClient.signIn.email({
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        rememberMe: false,
      });

      if (result.error) {
        setError(
          result.error.status === 429
            ? "Too many attempts. Please wait and try again."
            : "Unable to sign in. Check your email and password.",
        );

        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5"
      aria-busy={isPending}
    >
      <fieldset disabled={isPending} className="space-y-5">
        <div>
          <label htmlFor="admin-email" className="text-sm font-medium">
            Email
          </label>

          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="text-sm font-medium">
            Password
          </label>

          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-primary w-full rounded-xl px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </fieldset>
    </form>
  );
}
