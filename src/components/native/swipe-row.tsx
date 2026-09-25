import { ReactNode, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeRowProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

const THRESHOLD = 64;
const MAX = 144;

export function SwipeRow({ children, onEdit, onDelete }: SwipeRowProps) {
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  const clamp = (v: number) => Math.max(-MAX, Math.min(0, v));

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startX.current === null) return;
    const delta = e.clientX - startX.current;
    const base = open ? -MAX : 0;
    setOffset(clamp(base + delta));
  };

  const endDrag = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    dragging.current = false;
    startX.current = null;
    if (delta < -THRESHOLD) {
      setOpen(true);
      setOffset(-MAX);
    } else {
      setOpen(false);
      setOffset(0);
    }
  };

  const close = () => {
    setOpen(false);
    setOffset(0);
  };

  return (
    <div className="relative select-none overflow-hidden rounded-2xl">
      {/* actions revealed underneath */}
      <div className="absolute inset-y-0 right-0 flex">
        <button
          aria-label="Edit"
          className="flex w-[72px] items-center justify-center bg-muted text-muted-foreground"
          onClick={() => {
            close();
            onEdit();
          }}
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          aria-label="Delete"
          className="flex w-[72px] items-center justify-center bg-red-600/90 text-white"
          onClick={() => {
            close();
            onDelete();
          }}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div
        className={cn(
          "relative bg-secondary",
          !dragging.current && "transition-transform duration-150 ease-out"
        )}
        style={{ transform: `translateX(${offset}px)`, touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
    </div>
  );
}
