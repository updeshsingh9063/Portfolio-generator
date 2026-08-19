"use client";

import * as React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar } from "./avatar";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "./dropdown";
import { initials } from "@/lib/portfolio/helpers";

/**
 * Reusable signed-in account menu: avatar/user trigger → Dashboard + Sign out.
 * Pass `name` where the session is known (e.g. server pages); omit it in
 * client contexts that don't have the name and a neutral icon is shown.
 */
export function AccountMenu({
  name,
  showDashboard = true,
  align = "end",
}: {
  name?: string;
  showDashboard?: boolean;
  align?: "start" | "end";
}) {
  const label = name?.trim();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          aria-label="Account menu"
          className="rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {label ? (
            <Avatar size="sm" fallback={initials(label)} />
          ) : (
            <span className="grid size-9 place-items-center rounded-full bg-surface-2 text-muted transition-colors hover:text-foreground">
              <User className="size-[1.05rem]" />
            </span>
          )}
        </button>
      </DropdownTrigger>
      <DropdownContent align={align}>
        {label && (
          <>
            <div className="px-2.5 py-2 text-caption text-faint">Signed in as</div>
            <div className="truncate px-2.5 pb-2 text-[0.85rem] font-medium text-foreground">
              {label}
            </div>
            <DropdownSeparator />
          </>
        )}
        {showDashboard && (
          <DropdownItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard /> Dashboard
            </Link>
          </DropdownItem>
        )}
        <DropdownItem destructive onSelect={() => signOut({ callbackUrl: "/" })}>
          <LogOut /> Sign out
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
