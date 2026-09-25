import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface SwipeRowProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

const THRESHOLD = 56;
const MAX = 144;

export function SwipeRow({ children, onEdit, onDelete }: SwipeRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative select-none overflow-hidden rounded-2xl">
      <div className="absolute inset-y-0 right-0 flex">
        <button
          aria-label="Edit"
          className="flex w-[72px] items-center justify-center bg-muted text-muted-foreground"
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          aria-label="Delete"
          className="flex w-[72px] items-center justify-center bg-red-600/90 text-white"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <motion.div
        className="relative bg-secondary"
        drag="x"
        dragConstraints={{ left: -MAX, right: 0 }}
        dragElastic={{ left: 0.12, right: 0.02 }}
        onDragEnd={(_e, info) => {
          if (info.offset.x < -THRESHOLD || info.velocity.x < -500) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        animate={{ x: open ? -MAX : 0 }}
        transition={{ type: "spring", stiffness: 480, damping: 38 }}
        style={{ touchAction: "pan-y" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
