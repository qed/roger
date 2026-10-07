import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1], delay }}>
      
      {children}
    </motion.div>);

}