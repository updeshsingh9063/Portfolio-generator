import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "wide" | "narrow";

const widths: Record<ContainerWidth, string> = {
  narrow: "max-w-[820px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1360px]",
};

export function Container({
  className,
  width = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { width?: ContainerWidth }) {
  return (
    <div
      className={cn("mx-auto w-full px-6 sm:px-8 lg:px-10", widths[width], className)}
      {...props}
    />
  );
}
