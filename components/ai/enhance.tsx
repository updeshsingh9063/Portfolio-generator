"use client";

import * as React from "react";
import { Sparkles, RotateCw, AlertTriangle } from "lucide-react";
import { enhanceText, type EnhanceKind } from "@/app/actions/ai";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Spinner } from "@/components/ui/loading-state";
import { toast } from "@/components/ui/toast";

type State =
  | { status: "loading" }
  | { status: "ready"; suggestion: string }
  | { status: "not_configured" }
  | { status: "error"; message?: string };

/** "Enhance with AI" affordance for a text field. Results are editable. */
export function AIEnhance({
  kind,
  value,
  onAccept,
  label = "Enhance",
}: {
  kind: EnhanceKind;
  value: string;
  onAccept: (next: string) => void;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<State>({ status: "loading" });

  const run = React.useCallback(async () => {
    setState({ status: "loading" });
    const res = await enhanceText(kind, value);
    if (res.ok) setState({ status: "ready", suggestion: res.text });
    else if (res.reason === "not_configured") setState({ status: "not_configured" });
    else setState({ status: "error", message: res.message });
  }, [kind, value]);

  const start = () => {
    if (!value.trim()) {
      toast.error("Add a little text first", { description: "AI sharpens what you've written." });
      return;
    }
    setOpen(true);
    run();
  };

  return (
    <>
      <button
        type="button"
        onClick={start}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-accent/30 bg-accent/8 px-2.5 py-1 text-caption font-medium text-accent-deep transition-colors hover:bg-accent/15"
      >
        <Sparkles className="size-3.5" /> {label}
      </button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent-deep" /> Enhance with AI
            </ModalTitle>
            <ModalDescription>
              A polished suggestion — edit it freely, then accept. Nothing changes until you do.
            </ModalDescription>
          </ModalHeader>

          {state.status === "loading" && <Spinner label="Writing a better version…" />}

          {state.status === "ready" && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="overline mb-1.5">Your text</p>
                <p className="rounded-[var(--radius-md)] bg-surface-2 p-3 text-small text-muted">{value}</p>
              </div>
              <div>
                <p className="overline mb-1.5 !text-accent-deep">Suggestion (editable)</p>
                <Textarea
                  rows={4}
                  value={state.suggestion}
                  onChange={(e) => setState({ status: "ready", suggestion: e.target.value })}
                />
              </div>
            </div>
          )}

          {state.status === "not_configured" && (
            <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-warning/30 bg-warning/5 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
              <div className="text-small text-muted">
                <p className="font-medium text-foreground">AI isn't configured yet</p>
                <p className="mt-1">
                  Add a <code className="rounded bg-surface-2 px-1">GROQ_API_KEY</code> to your
                  <code className="mx-1 rounded bg-surface-2 px-1">.env.local</code> to enable AI
                  enhancement. Everything else works without it.
                </p>
              </div>
            </div>
          )}

          {state.status === "error" && (
            <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-error" />
              <div className="text-small text-muted">
                <p className="font-medium text-foreground">Something went wrong</p>
                <p className="mt-1">{state.message || "Please try again."}</p>
              </div>
            </div>
          )}

          <ModalFooter>
            {state.status === "ready" ? (
              <>
                <Button variant="ghost" onClick={run}>
                  <RotateCw className="size-4" /> Regenerate
                </Button>
                <ModalClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </ModalClose>
                <Button
                  variant="accent"
                  onClick={() => {
                    onAccept(state.suggestion);
                    setOpen(false);
                    toast.success("Applied");
                  }}
                >
                  Use this
                </Button>
              </>
            ) : state.status === "error" ? (
              <>
                <ModalClose asChild>
                  <Button variant="ghost">Close</Button>
                </ModalClose>
                <Button variant="primary" onClick={run}>
                  <RotateCw className="size-4" /> Try again
                </Button>
              </>
            ) : (
              <ModalClose asChild>
                <Button variant="ghost">Close</Button>
              </ModalClose>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
