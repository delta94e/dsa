"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Card, ThemeIcon, Title, Text } from "@mantine/core";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({
  icon,
  iconColor,
  iconBg,
  title,
  description,
  index,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        shadow={isHovered ? "lg" : "sm"}
        padding="xl"
        radius="lg"
        style={{
          background: "white",
          border: "1px solid #E4E6EB",
          height: "100%",
          transition: "box-shadow 0.3s, border-color 0.3s",
          borderColor: isHovered ? "#1877F2" : "#E4E6EB",
        }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ type: "spring" as const, stiffness: 300 }}
        >
          <ThemeIcon
            size={56}
            radius="lg"
            mb="md"
            style={{
              background: iconBg,
              color: iconColor,
            }}
          >
            {icon}
          </ThemeIcon>
        </motion.div>

        <Title order={4} mb="xs" style={{ color: "#1C1E21", fontWeight: 700 }}>
          {title}
        </Title>

        <Text size="sm" lh={1.6} style={{ color: "#65676B" }}>
          {description}
        </Text>
      </Card>
    </motion.div>
  );
}

export default FeatureCard;
