import { ArrowDownRight } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio/schema";
import { SafeImage } from "@/components/portfolio/shared/safe-image";
import { Seal } from "@/components/portfolio/shared/seal";
import { initials } from "@/lib/portfolio/helpers";

export function Hero({ data }: { data: PortfolioData }) {
  const { profile } = data;
  const heroWord = profile.heroWord || "Portfolio";
  const [firstName, ...rest] = profile.fullName.split(" ");
  const lastName = rest.join(" ");

  return (
    <section className="relative overflow-hidden bg-paper pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        {/* Giant editorial display word */}
        <h1 className="relative z-10 select-none font-display text-[clamp(3.5rem,20vw,16rem)] font-medium leading-[0.82] tracking-[-0.02em] text-foreground">
          {heroWord}
        </h1>

        <div className="relative mt-6 grid grid-cols-1 gap-x-8 lg:mt-2 lg:grid-cols-12">
          {/* Left column: kicker, headline, bio, name */}
          <div className="relative z-20 order-2 flex flex-col lg:order-1 lg:col-span-5 lg:pt-2">
            <p className="overline mb-4">{profile.kicker || "Portfolio"}</p>
            <h2 className="font-sans text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.05] tracking-[-0.01em] text-foreground">
              {profile.headline}
            </h2>
            <span className="mt-5 h-px w-14 bg-accent" />
            {profile.bio && (
              <p className="mt-5 max-w-sm text-body text-muted">{profile.bio}</p>
            )}

            <div className="mt-10 lg:mt-16">
              <p className="serif-spaced text-[clamp(2rem,5vw,3.4rem)] font-light uppercase leading-[0.95] text-accent-deep">
                {firstName}
                {lastName && (
                  <>
                    <br />
                    {lastName}
                  </>
                )}
              </p>
            </div>

            <a
              href="#projects"
              className="group mt-10 inline-flex w-fit items-center gap-2 text-caption font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
            >
              <span>Scroll to work</span>
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          {/* Right: portrait, overlapping the display word above */}
          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <div className="relative mx-auto aspect-[3/4] w-[min(78vw,30rem)] lg:-mt-[16vw] lg:ml-auto lg:mr-0">
              <SafeImage
                src={profile.avatar}
                alt={profile.fullName}
                fallbackLabel={initials(profile.fullName)}
                className="size-full rounded-[var(--radius-lg)]"
              />
              {/* Rotating seal */}
              {profile.availableForWork && (
                <div className="absolute -bottom-6 -left-6 grid size-[7.5rem] place-items-center rounded-full bg-paper/90 backdrop-blur-sm sm:-left-8 sm:size-32">
                  <Seal
                    text={profile.availabilityLabel || "Available for work"}
                    monogram={initials(profile.fullName).slice(0, 1)}
                    size={112}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 pb-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-caption uppercase tracking-[0.18em] text-faint">
            {profile.location && <span>{profile.location}</span>}
            {profile.currentStatus && (
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-success" />
                {profile.currentStatus}
              </span>
            )}
          </div>
          {profile.tagline && (
            <p className="font-serif text-lg italic text-muted">{profile.tagline}</p>
          )}
        </div>
      </div>
    </section>
  );
}
