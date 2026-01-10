"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Card, Text, Avatar, Group, Badge } from "@mantine/core";
import { IconQuote } from "@tabler/icons-react";

interface TestimonialCardProps {
  name: string;
  avatar: string;
  country: string;
  level: string;
  quote: string;
  index: number;
}

export function TestimonialCard({
  name,
  avatar,
  country,
  level,
  quote,
  index,
}: TestimonialCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    setRotateX((mouseY / (rect.height / 2)) * -5);
    setRotateY((mouseX / (rect.width / 2)) * 5);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

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
      whileHover={{ y: -8 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card
          shadow="sm"
          padding="xl"
          radius="lg"
          style={{
            background: "white",
            border: "1px solid #E4E6EB",
            position: "relative",
          }}
        >
          <IconQuote
            size={32}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#1877F2",
              opacity: 0.2,
            }}
          />

          <Text
            size="md"
            lh={1.7}
            mb="lg"
            style={{ color: "#1C1E21", fontStyle: "italic" }}
          >
            "{quote}"
          </Text>

          <Group gap="sm">
            <Avatar src={avatar} size={48} radius="xl" />
            <div>
              <Text fw={600} size="sm" style={{ color: "#1C1E21" }}>
                {name}
              </Text>
              <Text size="xs" c="dimmed">
                {country} • {level}
              </Text>
            </div>
          </Group>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default TestimonialCard;
