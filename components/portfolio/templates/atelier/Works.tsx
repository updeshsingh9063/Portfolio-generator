import { ArrowUpRight, Github } from "lucide-react";
import type { PortfolioData, Project } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { SafeImage } from "@/components/portfolio/shared/safe-image";
import { RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";

function ProjectCard({ project }: { project: Project }) {
  const href = project.liveUrl || project.githubUrl;
  const Wrapper = href ? "a" : "div";
  return (
    <RevealItem>
      <Wrapper
        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex h-full flex-col"
      >
        <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-line-dark bg-ink-soft">
          {/* mini browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-line-dark px-3.5 py-2.5">
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <SafeImage
              src={project.image}
              alt={project.name}
              fallbackLabel={project.name.slice(0, 1)}
              className="size-full"
              imgClassName="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
            />
            {href && (
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-paper/90 text-ink opacity-0 transition-all duration-[var(--duration-normal)] group-hover:opacity-100">
                {project.liveUrl ? <ArrowUpRight className="size-4" /> : <Github className="size-4" />}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center text-center">
          <h3 className="text-caption font-semibold uppercase tracking-[0.2em] text-on-dark transition-colors group-hover:text-accent-bright">
            {project.name}
          </h3>
          {project.category && (
            <p className="mt-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-on-dark-faint">
              {project.category}
            </p>
          )}
        </div>
      </Wrapper>
    </RevealItem>
  );
}

export function Works({ data }: { data: PortfolioData }) {
  return (
    <AtelierSection id="projects" tone="ink" containerClassName="max-w-[1280px]">
      <SectionHeader
        label="Selected Works"
        link={{ text: "View all works", href: "#contact" }}
        onDark
      />
      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </RevealGroup>
    </AtelierSection>
  );
}
