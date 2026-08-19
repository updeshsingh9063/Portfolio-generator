"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type AnimationIntensity = "none" | "subtle" | "expressive";

/** Provided at the portfolio root; controls reveal behaviour globally. */
export const AnimationContext = React.createContext<AnimationIntensity>("subtle");

/**
 * Subtle scroll-in: fade + 16px rise, once. Respects reduced-motion.
 * Keep it quiet — premium, not busy.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const intensity = React.useContext(AnimationContext);
  const MotionTag = motion[as];
  const off = reduce || intensity === "none";
  const yy = intensity === "expressive" ? y * 1.75 : y;

  const variants: Variants = {
    hidden: { opacity: off ? 1 : 0, y: off ? 0 : yy },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: intensity === "expressive" ? 0.85 : 0.7, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger container + item helpers for lists. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const intensity = React.useContext(AnimationContext);
  const off = reduce || intensity === "none";
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: off ? 1 : 0, y: off ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
