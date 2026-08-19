"use client";

import { Mail, MapPin, Phone, Globe } from "lucide-react";
import { useOnboarding } from "@/lib/store/onboarding";
import { StepIntro, FieldGrid } from "@/components/onboarding/step-shell";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { AvatarUpload } from "@/components/onboarding/avatar-upload";
import { AIEnhance } from "@/components/ai/enhance";

export function PersonalStep({ index }: { index: number }) {
  const profile = useOnboarding((s) => s.data.profile);
  const patch = useOnboarding((s) => s.patchProfile);

  return (
    <div>
      <StepIntro
        index={index}
        title="Let's start with you"
        subtitle="The essentials that anchor your portfolio. A name, a headline, and a line about what you do is enough to begin."
      />

      <div className="mb-7">
        <p className="mb-3 text-[0.8rem] font-medium text-foreground">Profile photo</p>
        <AvatarUpload value={profile.avatar} onChange={(v) => patch({ avatar: v ?? "" })} />
      </div>

      <FieldGrid>
        <FormField label="Full name" required>
          <Input
            value={profile.fullName}
            onChange={(e) => patch({ fullName: e.target.value })}
            placeholder="Alyssa Marlowe"
          />
        </FormField>
        <FormField
          label="Professional headline"
          required
          hint="Your role, in a few words."
          action={
            <AIEnhance kind="headline" value={profile.headline} onAccept={(t) => patch({ headline: t })} />
          }
        >
          <Input
            value={profile.headline}
            onChange={(e) => patch({ headline: e.target.value })}
            placeholder="Web & UI Designer"
          />
        </FormField>
        <FormField label="Email" required>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder="hello@you.com"
            startIcon={<Mail />}
          />
        </FormField>
        <FormField label="Location">
          <Input
            value={profile.location}
            onChange={(e) => patch({ location: e.target.value })}
            placeholder="New York, USA"
            startIcon={<MapPin />}
          />
        </FormField>
        <FormField label="Phone">
          <Input
            value={profile.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            startIcon={<Phone />}
          />
        </FormField>
        <FormField label="Website">
          <Input
            value={profile.website}
            onChange={(e) => patch({ website: e.target.value })}
            placeholder="www.you.com"
            startIcon={<Globe />}
          />
        </FormField>
        <FormField label="Header label" hint='Tiny label in the header, e.g. "UI Designer".'>
          <Input
            value={profile.roleLabel}
            onChange={(e) => patch({ roleLabel: e.target.value })}
            placeholder="UI Designer"
          />
        </FormField>
        <FormField label="Kicker" hint='Overline above your headline, e.g. "Creative".'>
          <Input
            value={profile.kicker}
            onChange={(e) => patch({ kicker: e.target.value })}
            placeholder="Creative"
          />
        </FormField>
      </FieldGrid>

      <div className="mt-5 grid grid-cols-1 gap-5">
        <FormField
          label="Short bio"
          hint="One or two sentences — shown in your hero."
          action={<AIEnhance kind="bio" value={profile.bio ?? ""} onAccept={(t) => patch({ bio: t })} />}
        >
          <Textarea
            value={profile.bio}
            onChange={(e) => patch({ bio: e.target.value })}
            placeholder="I design thoughtful digital experiences that combine strategy, aesthetics, and clarity to help brands stand out."
          />
        </FormField>
        <FormField
          label="About"
          hint="A fuller paragraph for your About section."
          action={<AIEnhance kind="about" value={profile.about ?? ""} onAccept={(t) => patch({ about: t })} />}
        >
          <Textarea
            rows={5}
            value={profile.about}
            onChange={(e) => patch({ about: e.target.value })}
            placeholder="For the past few years I've partnered with…"
          />
        </FormField>
        <FormField label="Tagline" hint="A short signature line for your footer.">
          <Input
            value={profile.tagline}
            onChange={(e) => patch({ tagline: e.target.value })}
            placeholder="Design that feels inevitable."
          />
        </FormField>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Toggle
            checked={profile.availableForWork}
            onCheckedChange={(v) => patch({ availableForWork: v })}
            id="available"
          />
          <div>
            <label htmlFor="available" className="text-[0.9rem] font-medium">
              Available for work
            </label>
            <p className="text-caption text-faint">Shows the rotating seal in your hero.</p>
          </div>
        </div>
        {profile.availableForWork && (
          <div className="sm:w-64">
            <Input
              value={profile.availabilityLabel}
              onChange={(e) => patch({ availabilityLabel: e.target.value })}
              placeholder="Available for freelance projects"
            />
          </div>
        )}
      </div>
    </div>
  );
}
