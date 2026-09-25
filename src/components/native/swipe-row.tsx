import { useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface SwipeRowProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

// Touch-first swipe-to-reveal actions, like a native list row.
export function SwipeRow({ children, onEdit, onDelete }: SwipeRowProps) {
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef<number | null>(null);
  const startOffset = useRef(0);
  const swiping = useRef(false);

  const THRESHOLD = 64;
  const MAX = 144;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startOffset.current = open ? -MAX : 0;
    swiping.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping.current || startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const next = Math.min(0, Math.max(-MAX, startOffset.current + dx));
    setOffset(next);
  };

  const onTouchEnd = () => {
    if (!swiping.current) return;
    swiping.current = false;
    startX.current = null;
    const shouldOpen = offset < -THRESHOLD;
    setOpen(shouldOpen);
    setOffset(shouldOpen ? -MAX : 0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* actions revealed underneath */}
      <div className="absolute inset-y-0 right-0 flex w-36">
        <button
          className="flex flex-1 items-center justify-center bg-slate-700 text-white active:bg-slate-600"
          onClick={() => {
            setOpen(false);
            setOffset(0);
            onEdit();
          }}
          aria-label="Edit"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          className="flex flex-1 items-center justify-center bg-red-600 text-white active:bg-red-500"
          onClick={() => {
            setOpen(false);
            setOffset(0);
            onDelete();
          }}
          aria-label="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div
        className="relative transition-transform duration-150 ease-out"
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping.current ? "none" : undefined,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
