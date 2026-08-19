import type { PortfolioData, Testimonial } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { SafeImage } from "@/components/portfolio/shared/safe-image";
import { Reveal, RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";
import { initials } from "@/lib/portfolio/helpers";

function Attribution({ t, onDark = true }: { t: Testimonial; onDark?: boolean }) {
  if (!t.author) return null;
  return (
    <div className={onDark ? "text-on-dark" : "text-foreground"}>
      <p className="font-serif text-lg">{t.author}</p>
      {t.role && (
        <p className={onDark ? "text-caption uppercase tracking-[0.16em] text-on-dark-faint" : "text-caption text-faint"}>
          {t.role}
        </p>
      )}
    </div>
  );
}

export function Testimonials({ data }: { data: PortfolioData }) {
  const single = data.testimonials.length === 1;

  return (
    <AtelierSection id="testimonials" tone="ink">
      <SectionHeader label="Words" onDark />
      {single ? (
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {data.testimonials[0].image && (
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]">
                  <SafeImage
                    src={data.testimonials[0].image}
                    alt={data.testimonials[0].author || "Testimonial"}
                    fallbackLabel={initials(data.testimonials[0].author || "")}
                    className="size-full"
                  />
                </div>
              </div>
            )}
            <div className={data.testimonials[0].image ? "lg:col-span-7" : "lg:col-span-12"}>
              <span className="font-display text-6xl leading-none text-accent" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="mt-2 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium uppercase leading-[1.2] tracking-[0.01em] text-on-dark text-balance">
                {data.testimonials[0].quote}
              </blockquote>
              <div className="mt-8">
                <Attribution t={data.testimonials[0]} />
              </div>
            </div>
          </div>
        </Reveal>
      ) : (
        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.testimonials.map((t) => (
            <RevealItem key={t.id}>
              <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-line-dark bg-ink-soft p-8">
                <span className="font-display text-4xl leading-none text-accent" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="mt-2 font-serif text-xl leading-relaxed text-on-dark">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-4">
                  {t.image && (
                    <span className="size-11 overflow-hidden rounded-full">
                      <SafeImage src={t.image} alt={t.author || ""} className="size-full" />
                    </span>
                  )}
                  <Attribution t={t} />
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </AtelierSection>
  );
}
