import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export function CountUp({ value, prefix = "₹" }: { value: number; prefix?: string }) {
  const spring = useSpring(0, { stiffness: 90, damping: 22 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(Math.abs(v)).toLocaleString("en-IN")}`);
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span>{display}</motion.span>;
}
