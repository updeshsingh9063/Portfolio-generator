import Link from "next/link";
import { Wordmark } from "@/components/ui/navigation";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="grain flex min-h-screen items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Wordmark className="mb-6" />
          <h1 className="font-display text-h2 leading-tight text-foreground">{title}</h1>
          <p className="mt-2 text-small text-muted">{subtitle}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-7">
          {children}
        </div>
        <p className="mt-6 text-center text-small text-muted">{footer}</p>
        <p className="mt-8 text-center text-caption text-faint">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
