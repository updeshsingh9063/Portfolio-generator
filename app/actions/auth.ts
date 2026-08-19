"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export type SignUpResult = { ok: true } | { ok: false; error: string };

/** Create an email/password account. Sign-in happens client-side afterwards. */
export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<SignUpResult> {
  const name = input.name?.trim();
  const email = input.email?.toLowerCase().trim();
  const password = input.password ?? "";

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Please enter a valid email." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  return { ok: true };
}
