import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type Tone = "paper" | "surface" | "ink";

const tones: Record<Tone, string> = {
  paper: "bg-paper text-foreground",
  surface: "bg-surface text-foreground",
  ink: "bg-ink text-on-dark",
};

export function Section({
  className,
  tone = "paper",
  container = true,
  containerWidth = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  tone?: Tone;
  container?: boolean;
  containerWidth?: "default" | "wide" | "narrow";
}) {
  return (
    <section
      className={cn("py-20 sm:py-24 lg:py-32", tones[tone], className)}
      {...props}
    >
      {container ? (
        <Container width={containerWidth}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

/** Small labelled section header: gold overline + optional title + link. */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("overline", className)}>{children}</p>;
}
