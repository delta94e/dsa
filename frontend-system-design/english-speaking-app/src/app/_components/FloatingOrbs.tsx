"use client";

import { motion } from "motion/react";

export function FloatingOrbs() {
  const orbConfigs = [
    {
      size: 500,
      color: "rgba(24, 119, 242, 0.08)",
      initialX: -150,
      initialY: -100,
      animateX: [0, 80, 0],
      animateY: [0, -50, 0],
      duration: 30,
    },
    {
      size: 400,
      color: "rgba(66, 103, 178, 0.06)",
      initialX: "70%",
      initialY: -100,
      animateX: [0, -60, 0],
      animateY: [0, 60, 0],
      duration: 25,
    },
    {
      size: 300,
      color: "rgba(24, 119, 242, 0.05)",
      initialX: "50%",
      initialY: "60%",
      animateX: [0, -40, 0],
      animateY: [0, -30, 0],
      duration: 20,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {orbConfigs.map((orb, index) => (
        <motion.div
          key={index}
          initial={{ x: orb.initialX, y: orb.initialY }}
          animate={{
            x: orb.animateX,
            y: orb.animateY,
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear" as const,
          }}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
}

export default FloatingOrbs;
