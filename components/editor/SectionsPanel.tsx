"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/lib/store/onboarding";
import type { SectionKey } from "@/lib/portfolio/schema";
import { SECTION_LABELS, sectionHasData } from "@/lib/portfolio/helpers";
import { Toggle } from "@/components/ui/toggle";

function Row({
  id,
  label,
  hasData,
  hidden,
  onToggle,
}: {
  id: SectionKey;
  label: string;
  hasData: boolean;
  hidden: boolean;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2.5",
        isDragging && "z-10 shadow-lg",
        hidden && "opacity-60"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-faint hover:text-foreground active:cursor-grabbing"
        aria-label={`Reorder ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="flex flex-1 items-center gap-2">
        <span className="text-[0.88rem] font-medium text-foreground">{label}</span>
        {!hasData && (
          <span className="rounded-[var(--radius-pill)] bg-surface-2 px-2 py-0.5 text-[0.65rem] text-faint">
            empty
          </span>
        )}
      </div>
      {hidden ? (
        <EyeOff className="size-4 text-faint" />
      ) : (
        <Eye className="size-4 text-accent-deep" />
      )}
      <Toggle checked={!hidden} onCheckedChange={(v) => onToggle(!v)} aria-label={`Toggle ${label}`} />
    </div>
  );
}

export function SectionsPanel() {
  const settings = useOnboarding((s) => s.data.settings);
  const data = useOnboarding((s) => s.data);
  const patch = useOnboarding((s) => s.patchSettings);

  const order: SectionKey[] = settings.sectionOrder.filter((k) => k !== "contact");
  const hidden = new Set(settings.hiddenSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id as SectionKey);
    const newIndex = order.indexOf(over.id as SectionKey);
    const next = arrayMove(order, oldIndex, newIndex);
    patch({ sectionOrder: [...next, "contact"] });
  };

  const toggleHidden = (key: SectionKey, hide: boolean) => {
    const set = new Set(settings.hiddenSections);
    if (hide) set.add(key);
    else set.delete(key);
    patch({ hiddenSections: [...set] });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-[0.9rem] font-medium text-foreground">Sections</h3>
        <p className="mt-0.5 text-caption text-faint">
          Drag to reorder. Toggle to show or hide. Empty sections are hidden automatically.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {order.map((key) => (
              <Row
                key={key}
                id={key}
                label={SECTION_LABELS[key]}
                hasData={sectionHasData(data, key)}
                hidden={hidden.has(key)}
                onToggle={(hide) => toggleHidden(key, hide)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2.5 opacity-70">
        <div className="flex items-center gap-2 text-[0.88rem] text-muted">
          <span className="font-medium">Contact</span>
          <span className="text-caption text-faint">· always shown</span>
        </div>
      </div>
    </div>
  );
}
