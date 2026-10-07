"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    if (isPending) return;

    setError("");
    setIsPending(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError("Unable to sign out. Please try again.");
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {isPending ? "Signing out..." : "Sign out"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
