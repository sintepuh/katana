'use client';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ x: -50, scale: 0.95, opacity: 0 }}
        animate={{ 
          x: 0, 
          scale: 1, 
          opacity: 1,
          transitionEnd: { willChange: "auto" } 
        }}
        exit={{ x: 50, scale: 0.95, opacity: 0 }}
        transition={{ 
          duration: 0.35, 
          ease: [0.4, 0, 0.2, 1],
          willChange: "transform, opacity"
        }}
        className="relative"
      >
        <div className="contents" style={{ willChange: "auto" }}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
