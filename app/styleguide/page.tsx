"use client";

import * as React from "react";
import {
  Bell,
  Bookmark,
  Check,
  Github,
  Heart,
  Mail,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Copy,
  Share2,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { ProgressBar, SkillMeter } from "@/components/ui/progress-bar";
import { StepIndicator } from "@/components/ui/step-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, Spinner, CardSkeleton } from "@/components/ui/loading-state";
import { toast } from "@/components/ui/toast";

/* --------------------------------- helpers -------------------------------- */

function Block({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24 border-t border-line py-14 first:border-t-0">
      <div className="mb-7">
        <h2 className="font-display text-h3 text-foreground">{title}</h2>
        {desc && <p className="mt-1 text-small text-muted">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({
  name,
  varName,
  dark,
}: {
  name: string;
  varName: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-[var(--radius-md)] border border-line"
        style={{ background: `var(--color-${varName})` }}
      />
      <div className="flex flex-col">
        <span className="text-[0.78rem] font-medium text-foreground">{name}</span>
        <span className="font-mono text-[0.68rem] text-faint">--color-{varName}</span>
      </div>
    </div>
  );
}

const steps = [
  { id: "personal", label: "Personal" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

/* ---------------------------------- page ---------------------------------- */

export default function StyleguidePage() {
  const [step, setStep] = React.useState(2);
  const [progress, setProgress] = React.useState(64);

  return (
    <main className="grain min-h-screen">
      {/* header */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-[1100px] px-6 py-16 sm:px-8">
          <p className="overline mb-5">Folio · Design System</p>
          <h1 className="font-display text-h1 leading-none text-foreground">
            The component language
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-muted">
            Every token and primitive that composes the product and the generated portfolios —
            derived from the editorial reference. Warm paper, warm black, one bronze accent.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 sm:px-8">
        {/* COLOR */}
        <Block title="Color" desc="Semantic tokens as CSS variables — the single source of truth.">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            <Swatch name="Paper" varName="paper" />
            <Swatch name="Surface" varName="surface" />
            <Swatch name="Surface 2" varName="surface-2" />
            <Swatch name="Ink" varName="ink" dark />
            <Swatch name="Ink warm" varName="ink-warm" dark />
            <Swatch name="Ink soft" varName="ink-soft" dark />
            <Swatch name="Accent" varName="accent" />
            <Swatch name="Accent bright" varName="accent-bright" />
            <Swatch name="Accent deep" varName="accent-deep" />
            <Swatch name="Foreground" varName="foreground" dark />
            <Swatch name="Muted" varName="muted" />
            <Swatch name="Faint" varName="faint" />
            <Swatch name="Line" varName="line" />
            <Swatch name="Success" varName="success" />
            <Swatch name="Warning" varName="warning" />
            <Swatch name="Error" varName="error" />
          </div>
        </Block>

        {/* TYPOGRAPHY */}
        <Block
          title="Typography"
          desc="Playfair Display (Didone display) · Cormorant Garamond (spaced serif) · Inter (UI)."
        >
          <div className="space-y-8">
            <div className="overflow-hidden">
              <p className="overline mb-3">Display · Playfair</p>
              <p className="font-display text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.9] tracking-tight text-foreground">
                Portfolio
              </p>
            </div>
            <div className="grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="overline mb-1">H1</p>
                  <p className="font-display text-h1 text-foreground">Build a portfolio worth sharing</p>
                </div>
                <div>
                  <p className="overline mb-1">H2</p>
                  <p className="font-display text-h2 text-foreground">Selected works</p>
                </div>
                <div>
                  <p className="overline mb-1">H3</p>
                  <p className="font-display text-h3 text-foreground">My process</p>
                </div>
                <div>
                  <p className="overline mb-1">Name · serif-spaced</p>
                  <p className="serif-spaced text-[2rem] text-accent-deep">ALYSSA MARLOWE</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="overline mb-1">Body large</p>
                  <p className="text-body-lg text-muted">
                    I design thoughtful digital experiences that combine strategy, aesthetics, and
                    clarity to help brands stand out.
                  </p>
                </div>
                <div>
                  <p className="overline mb-1">Body</p>
                  <p className="text-body text-muted">
                    The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor
                    jugs.
                  </p>
                </div>
                <div>
                  <p className="overline mb-1">Small · Caption</p>
                  <p className="text-small text-muted">Small — recruiter-ready summaries.</p>
                  <p className="text-caption text-faint">Caption — metadata and helper text.</p>
                </div>
                <div>
                  <p className="overline mb-1">Overline</p>
                  <p className="overline">Selected works</p>
                </div>
              </div>
            </div>
          </div>
        </Block>

        {/* BUTTONS */}
        <Block title="Buttons" desc="One small family — primary, accent, and quiet variants.">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Create my portfolio</Button>
            <Button variant="accent">
              <Sparkles className="size-4" /> Enhance with AI
            </Button>
            <Button variant="outline">Explore templates</Button>
            <Button variant="subtle">Save draft</Button>
            <Button variant="ghost">Skip</Button>
            <Button variant="link">Learn more</Button>
            <Button loading>Publishing</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="pill" variant="accent">
              Pill
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <IconButton aria-label="Search" variant="outline">
              <Search />
            </IconButton>
            <IconButton aria-label="Copy" variant="ghost">
              <Copy />
            </IconButton>
            <IconButton aria-label="Share" variant="solid">
              <Share2 />
            </IconButton>
            <IconButton aria-label="Like" variant="accent" shape="square">
              <Heart />
            </IconButton>
          </div>
        </Block>

        {/* BADGES */}
        <Block title="Badges" desc="Categories, statuses, and skill tags.">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="solid">Published</Badge>
            <Badge variant="accent">Pro</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="muted">Draft</Badge>
            <Badge variant="success">
              <Check className="size-3" /> Available
            </Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Failed</Badge>
            <Badge variant="accent" pill>
              TypeScript
            </Badge>
            <Badge variant="outline" pill>
              Next.js
            </Badge>
          </div>
        </Block>

        {/* FORM CONTROLS */}
        <Block title="Form controls" desc="Inputs, textarea, select, checkbox, toggle — accessible by default.">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Full name" required hint="As it should appear on your portfolio.">
              <Input placeholder="Alyssa Marlowe" />
            </FormField>
            <FormField label="Email" required error="Please enter a valid email address.">
              <Input type="email" placeholder="you@example.com" startIcon={<Mail />} defaultValue="not-an-email" />
            </FormField>
            <FormField label="Username" hint="folio.app/alyssa">
              <Input placeholder="alyssa" endIcon={<Check className="text-success" />} />
            </FormField>
            <FormField label="Current status">
              <Select defaultValue="open">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open to work</SelectItem>
                  <SelectItem value="freelance">Available for freelance</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                  <SelectItem value="none">Not specified</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Short bio" className="sm:col-span-2" hint="A sentence or two — AI can refine it later.">
              <Textarea placeholder="I design thoughtful digital experiences…" />
            </FormField>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8">
            <label className="flex cursor-pointer items-center gap-2.5">
              <Checkbox defaultChecked />
              <span className="text-[0.9rem]">Currently working here</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <Checkbox />
              <span className="text-[0.9rem]">Feature this project</span>
            </label>
            <div className="flex items-center gap-2.5">
              <Toggle defaultChecked id="sg-toggle" />
              <span className="text-[0.9rem]">Show Experience section</span>
            </div>
          </div>
        </Block>

        {/* CARDS */}
        <Block title="Cards" desc="Surfaces on cream and on ink — interactive on hover.">
          <div className="grid gap-5 sm:grid-cols-3">
            <Card variant="surface" interactive>
              <Badge variant="accent" size="sm">
                Fashion Brand
              </Badge>
              <CardTitle className="mt-4">Velure</CardTitle>
              <CardDescription className="mt-1">Web design & art direction for a luxury label.</CardDescription>
            </Card>
            <Card variant="outline" interactive>
              <Badge variant="muted" size="sm">
                Interior Studio
              </Badge>
              <CardTitle className="mt-4">Calm by Design</CardTitle>
              <CardDescription className="mt-1">A serene digital home for a design practice.</CardDescription>
            </Card>
            <Card variant="ink" interactive>
              <Badge variant="onDark" size="sm">
                Restaurant
              </Badge>
              <CardTitle className="mt-4 text-on-dark">Savor</CardTitle>
              <CardDescription className="mt-1 text-on-dark-muted">
                Immersive storytelling for a fine-dining brand.
              </CardDescription>
            </Card>
          </div>
        </Block>

        {/* AVATARS */}
        <Block title="Avatars" desc="With fallback initials.">
          <div className="flex items-center gap-4">
            <Avatar size="sm" fallback="AM" />
            <Avatar size="md" fallback="US" />
            <Avatar size="lg" fallback="JS" shape="rounded" />
            <Avatar size="xl" fallback="AM" />
          </div>
        </Block>

        {/* TABS + PREVIEW SWITCHER */}
        <Block title="Tabs" desc="Used for the editor's device preview switcher and content grouping.">
          <Tabs defaultValue="desktop">
            <TabsList>
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="tablet">Tablet</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="desktop">
              <p className="text-small text-muted">The live preview renders at full width.</p>
            </TabsContent>
            <TabsContent value="tablet">
              <p className="text-small text-muted">The preview constrains to a tablet frame.</p>
            </TabsContent>
            <TabsContent value="mobile">
              <p className="text-small text-muted">The preview constrains to a phone frame.</p>
            </TabsContent>
          </Tabs>
        </Block>

        {/* OVERLAYS */}
        <Block title="Overlays" desc="Tooltip, dropdown menu, and modal — Radix-powered for accessibility.">
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip content="Copy portfolio URL">
              <Button variant="outline">
                <Copy className="size-4" /> Hover me
              </Button>
            </Tooltip>

            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="outline">
                  Portfolio actions <MoreHorizontal className="size-4" />
                </Button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownLabel>Manage</DropdownLabel>
                <DropdownItem>
                  <Settings /> Edit portfolio
                </DropdownItem>
                <DropdownItem>
                  <Copy /> Copy URL
                </DropdownItem>
                <DropdownItem>
                  <Bookmark /> Duplicate
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem destructive>
                  <Trash2 /> Delete
                </DropdownItem>
              </DropdownContent>
            </Dropdown>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="primary">Publish portfolio</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Publish your portfolio</ModalTitle>
                  <ModalDescription>
                    Your portfolio will be live at folio.app/alyssa and indexable by search engines.
                  </ModalDescription>
                </ModalHeader>
                <FormField label="Username">
                  <Input defaultValue="alyssa" startIcon={<span className="text-faint">folio.app/</span>} />
                </FormField>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </ModalClose>
                  <Button variant="accent" onClick={() => toast.success("Portfolio published!")}>
                    Publish now
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Button variant="subtle" onClick={() => toast.success("Changes saved", { description: "Autosaved just now." })}>
              <Bell className="size-4" /> Trigger toast
            </Button>
          </div>
        </Block>

        {/* PROGRESS + STEPS */}
        <Block title="Progress & steps" desc="Onboarding rail, progress bars, and skill meters.">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,240px)_1fr]">
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <StepIndicator steps={steps} current={step} onStepClick={setStep} />
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                  Back
                </Button>
                <Button size="sm" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
                  Continue
                </Button>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-small font-medium">Profile completeness</span>
                  <Button size="sm" variant="ghost" onClick={() => setProgress((p) => (p >= 100 ? 20 : p + 12))}>
                    <Plus className="size-3.5" /> Add
                  </Button>
                </div>
                <ProgressBar value={progress} showLabel />
              </div>
              <div className="space-y-4">
                <p className="overline">Skills</p>
                <SkillMeter label="React & Next.js" value={92} />
                <SkillMeter label="TypeScript" value={85} />
                <SkillMeter label="UI / Visual design" value={78} />
              </div>
            </div>
          </div>
        </Block>

        {/* STATES */}
        <Block title="States" desc="Empty and loading states — never a blank screen.">
          <div className="grid gap-6 lg:grid-cols-2">
            <EmptyState
              icon={<Github />}
              title="No projects yet"
              description="Add your first project to bring your portfolio to life. Empty sections stay hidden automatically."
              action={
                <Button variant="accent">
                  <Plus className="size-4" /> Add a project
                </Button>
              }
            />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
                <Spinner label="Generating your portfolio…" />
              </div>
            </div>
          </div>
        </Block>

        {/* ON-DARK SHOWCASE */}
        <Block title="On ink" desc="The same system on the reference's warm-black surface.">
          <div className="rounded-[var(--radius-lg)] bg-ink p-8 text-on-dark sm:p-12">
            <div className="mb-8 flex items-center justify-between">
              <p className="overline text-accent-bright">Selected works</p>
              <span className="flex items-center gap-2 text-caption uppercase tracking-widest text-on-dark-muted">
                View all works →
              </span>
            </div>
            <p className="font-display text-[clamp(2rem,6vw,4rem)] leading-tight">
              Let&apos;s create something beautiful
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="onDark">Get in touch</Button>
              <Button variant="ghost" className="text-on-dark hover:bg-white/10">
                Download resume
              </Button>
              <Badge variant="onDark">Open to work</Badge>
            </div>
          </div>
        </Block>

        <footer className="border-t border-line py-12 text-center">
          <p className="text-caption text-faint">
            Folio design system · Phase 2 · Awaiting approval
          </p>
        </footer>
      </div>
    </main>
  );
}
