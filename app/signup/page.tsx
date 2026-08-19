"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock } from "lucide-react";
import { signUp } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signUp({ name, email, password });
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Build and publish your portfolio in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alyssa Marlowe" startIcon={<User />} required autoComplete="name" />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" startIcon={<Mail />} required autoComplete="email" />
        </FormField>
        <FormField label="Password" hint="At least 8 characters.">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" startIcon={<Lock />} required autoComplete="new-password" />
        </FormField>
        {error && <p className="text-caption text-error">{error}</p>}
        <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1 w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
