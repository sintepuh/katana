'use client';

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="contents" // Важно!
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}