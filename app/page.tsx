import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { Wordmark } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/ui/account-menu";

export default async function Home() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className="grain flex min-h-screen flex-col bg-paper">
      {/* Header */}
      <header className="border-b border-line/60">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:px-8">
          <Wordmark />
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/preview"
              className="hidden px-3 text-[0.85rem] font-medium text-muted transition-colors hover:text-foreground sm:inline"
            >
              Example
            </Link>
            {signedIn ? (
              <>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <AccountMenu name={session?.user?.name ?? session?.user?.email ?? undefined} />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="overline mb-6">Build your professional portfolio in minutes</p>
        <h1 className="font-display text-[clamp(3rem,11vw,8rem)] leading-[0.9] tracking-tight text-foreground">
          Folio
        </h1>
        <p className="mt-6 max-w-lg text-body-lg text-muted text-balance">
          Enter your experience, projects, skills, and achievements. Get a premium portfolio website
          you can share with recruiters and clients.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href={signedIn ? "/create" : "/signup"}>
              Create my portfolio
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/preview">Explore the template</Link>
          </Button>
        </div>
        <p className="mt-6 text-caption text-faint">
          Free to start · No credit card ·{" "}
          <Link href="/login" className="underline-offset-4 hover:text-foreground hover:underline">
            Already have an account?
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-6 text-caption text-faint sm:flex-row sm:px-8">
          <span>© 2026 Folio</span>
          <div className="flex items-center gap-5">
            <Link href="/signup" className="transition-colors hover:text-foreground">Sign up</Link>
            <Link href="/login" className="transition-colors hover:text-foreground">Sign in</Link>
            <Link href="/styleguide" className="transition-colors hover:text-foreground">Design system</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
