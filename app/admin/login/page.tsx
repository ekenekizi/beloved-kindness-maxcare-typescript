import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import LoginForm from "@/features/auth/components/LoginForm";
import { getCurrentSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getCurrentSession();

  if (session?.user.role === "admin" && !session.user.banned) {
    redirect("/admin");
  }

  return (
    <main className="bg-section-muted flex min-h-dvh items-center justify-center px-6 py-12">
      <section
        aria-labelledby="login-heading"
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm"
      >
        <p className="text-primary text-sm font-semibold">{siteConfig.name}</p>

        <h1
          id="login-heading"
          className="mt-3 text-3xl font-bold text-slate-950"
        >
          Admin sign in
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Sign in to manage website content.
        </p>

        <LoginForm />

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-slate-600 hover:text-primary"
        >
          Back to website
        </Link>
      </section>
    </main>
  );
}
