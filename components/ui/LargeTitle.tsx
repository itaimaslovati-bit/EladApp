'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface LargeTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function LargeTitle({ title, subtitle, children }: LargeTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [height, setHeight] = useState(160);
  const refHeight = useRef(160);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      refHeight.current = h;
      setHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const opacity = useTransform(scrollY, [0, height * 0.5], [1, 0]);
  const scale = useTransform(scrollY, [0, height * 0.6], [1, 0.95]);
  const y = useTransform(scrollY, [0, height * 0.5], [0, -20]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className="px-4 pt-2 pb-4 pointer-events-auto"
    >
      <h1 className="text-[34px] font-bold leading-tight tracking-tight text-text-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[15px] text-text-secondary mt-0.5 tracking-body">
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  );
}
