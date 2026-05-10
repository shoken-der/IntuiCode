
"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const AiMentorOrb = ({ size = "lg", status = "idle" }: { size?: "sm" | "md" | "lg", status?: "idle" | "thinking" | "speaking" }) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-48 h-48 md:w-64 md:h-64",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: status === "thinking" ? [1, 1.1, 1] : 1,
          opacity: status === "thinking" ? [0.3, 0.6, 0.3] : 0.4,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-accent blur-3xl"
      />
      
      {/* Middle Layer */}
      <motion.div
        animate={{
          rotate: status === "thinking" ? 360 : 0,
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-accent/30 border-dashed"
      />

      {/* Main Orb Body */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-primary via-background to-accent/20 border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden flex items-center justify-center"
      >
        {/* Internal Core Pulsing */}
        <motion.div
          animate={{
            scale: status === "speaking" ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: status === "thinking" ? [0.4, 0.8, 0.4] : 0.6,
          }}
          transition={{ duration: status === "speaking" ? 0.5 : 2, repeat: Infinity }}
          className="w-1/3 h-1/3 rounded-full bg-accent shadow-[0_0_30px_rgba(102,218,255,0.6)]"
        />
        
        {/* Animated Rings inside */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-full h-px bg-white/50 rotate-45" />
          <div className="w-full h-px bg-white/50 -rotate-45" />
        </div>
      </motion.div>
    </div>
  );
};
