"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Undo2, Redo2, Check, Cloud, Eye, Pencil, Rocket, ArrowLeft } from "lucide-react";
import { useOnboarding, useTimeTravel } from "@/lib/store/onboarding";
import { loadPortfolio } from "@/app/actions/portfolio";
import { useHydrated } from "@/lib/use-hydrated";
import { PublishDialog } from "@/components/editor/PublishDialog";
import { Wordmark } from "@/components/ui/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/loading-state";
import { cn } from "@/lib/utils";

import { ContentPanel } from "@/components/editor/ContentPanel";
import { SectionsPanel } from "@/components/editor/SectionsPanel";
import { DesignPanel } from "@/components/editor/DesignPanel";
import { LivePreview } from "@/components/editor/LivePreview";

function SavedBadge() {
  const lastSavedAt = useOnboarding((s) => s.lastSavedAt);
  return (
    <span className="hidden items-center gap-1.5 text-caption text-faint sm:inline-flex">
      {lastSavedAt ? (
        <>
          <Check className="size-3.5 text-success" /> Saved
        </>
      ) : (
        <>
          <Cloud className="size-3.5" /> Autosave on
        </>
      )}
    </span>
  );
}

function EditorInner() {
  const hydrated = useHydrated();
  const params = useSearchParams();
  const loadId = params.get("id");
  const { undo, redo, canUndo, canRedo } = useTimeTravel();
  const [mobileMode, setMobileMode] = React.useState<"edit" | "preview">("edit");
  const [publishOpen, setPublishOpen] = React.useState(false);

  // Load an existing portfolio from the DB when arriving from the dashboard.
  React.useEffect(() => {
    if (!loadId) return;
    let active = true;
    (async () => {
      const loaded = await loadPortfolio(loadId);
      if (active && loaded) {
        useOnboarding.getState().loadData(loaded.data);
        useOnboarding.getState().setDbInfo({ dbId: loadId, slug: loaded.slug });
        useOnboarding.temporal.getState().clear();
      }
    })();
    return () => {
      active = false;
    };
  }, [loadId]);

  // Keyboard: undo / redo
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <Spinner label="Opening the editor…" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper">
      {/* Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface/70 px-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Exit editor" className="text-faint transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
          </Link>
          <Wordmark />
          <span className="hidden text-caption uppercase tracking-[0.2em] text-faint sm:inline">Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <Tooltip content="Undo (⌘Z)">
              <IconButton aria-label="Undo" variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
                <Undo2 />
              </IconButton>
            </Tooltip>
            <Tooltip content="Redo (⌘⇧Z)">
              <IconButton aria-label="Redo" variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
                <Redo2 />
              </IconButton>
            </Tooltip>
          </div>
          <SavedBadge />
          <Button variant="accent" size="sm" onClick={() => setPublishOpen(true)}>
            <Rocket className="size-4" /> Publish
          </Button>
        </div>
      </header>

      {/* Mobile mode toggle */}
      <div className="flex shrink-0 items-center gap-1 border-b border-line bg-paper p-2 lg:hidden">
        <button
          onClick={() => setMobileMode("edit")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] py-2 text-[0.85rem] font-medium transition-colors",
            mobileMode === "edit" ? "bg-ink text-on-dark" : "text-muted"
          )}
        >
          <Pencil className="size-4" /> Edit
        </button>
        <button
          onClick={() => setMobileMode("preview")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] py-2 text-[0.85rem] font-medium transition-colors",
            mobileMode === "preview" ? "bg-ink text-on-dark" : "text-muted"
          )}
        >
          <Eye className="size-4" /> Preview
        </button>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Editor panel */}
        <div
          className={cn(
            "flex w-full min-w-0 flex-col border-r border-line lg:w-[460px] lg:shrink-0",
            mobileMode === "preview" && "hidden lg:flex"
          )}
        >
          <Tabs defaultValue="content" className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-line px-4 py-3">
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">
                  Content
                </TabsTrigger>
                <TabsTrigger value="sections" className="flex-1">
                  Sections
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1">
                  Design
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              <TabsContent value="content" className="mt-0">
                <ContentPanel />
              </TabsContent>
              <TabsContent value="sections" className="mt-0">
                <SectionsPanel />
              </TabsContent>
              <TabsContent value="design" className="mt-0">
                <DesignPanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Live preview */}
        <LivePreview className={cn("flex-1", mobileMode === "edit" && "hidden lg:flex")} />
      </div>

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  );
}

export default function EditorPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <EditorInner />
    </React.Suspense>
  );
}
