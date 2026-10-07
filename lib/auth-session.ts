import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "admin" || session.user.banned) {
    notFound();
  }

  return session.user;
}
