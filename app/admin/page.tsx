import type { Metadata } from "next";

import SignOutButton from "@/features/auth/components/SignOutButton";
import { requireAdmin } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <main className="bg-section-muted min-h-dvh px-6 py-12">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-primary text-sm font-semibold">
              Content management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Welcome, {user.name}
            </h1>

            <p className="mt-3 text-slate-600">
              Your administrator session is active.
            </p>
          </div>

          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
