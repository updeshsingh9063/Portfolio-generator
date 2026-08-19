import { Plus } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio/schema";
import { Reveal } from "@/components/portfolio/shared/reveal";
import { initials } from "@/lib/portfolio/helpers";
import { socialIcon, socialLabel, socialHref } from "@/components/portfolio/shared/social-icon";

export function Contact({ data, year }: { data: PortfolioData; year: number }) {
  const { profile } = data;
  const cta = profile.tagline || "Let's create something beautiful";

  return (
    <footer id="contact" className="scroll-mt-20 bg-ink-warm text-on-dark">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* CTA */}
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.01em] text-on-dark">
                {cta}
              </h2>
              <span className="mt-8 inline-block text-accent">
                <Plus className="size-6" />
              </span>
            </Reveal>
          </div>

          {/* Connect */}
          <div className="lg:col-span-3">
            <p className="overline mb-5 !text-accent-bright">Let&apos;s connect</p>
            <ul className="flex flex-col gap-2.5 text-small text-on-dark-muted">
              {profile.email && (
                <li>
                  <a href={`mailto:${profile.email}`} className="transition-colors hover:text-on-dark">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.phone && <li>{profile.phone}</li>}
              {profile.website && <li>{profile.website}</li>}
              {profile.location && <li>Based in {profile.location}</li>}
            </ul>
          </div>

          {/* Follow */}
          <div className="lg:col-span-3">
            <p className="overline mb-5 !text-accent-bright">Follow</p>
            <ul className="flex flex-col gap-3">
              {data.socials.map((s) => {
                const Icon = socialIcon(s.platform);
                return (
                  <li key={s.id}>
                    <a
                      href={socialHref(s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-small text-on-dark-muted transition-colors hover:text-on-dark"
                    >
                      <span className="grid size-8 place-items-center rounded-full border border-line-dark transition-colors group-hover:border-accent">
                        <Icon className="size-3.5" />
                      </span>
                      {socialLabel(s)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Monogram + bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line-dark pt-8 sm:flex-row sm:items-center">
          <p className="text-caption uppercase tracking-[0.16em] text-on-dark-faint">
            © {year} {profile.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-caption uppercase tracking-[0.16em] text-on-dark-faint transition-colors hover:text-on-dark"
            >
              Made with Folio
            </a>
            <span className="font-display text-3xl font-medium tracking-tight text-on-dark">
              {initials(profile.fullName)}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
