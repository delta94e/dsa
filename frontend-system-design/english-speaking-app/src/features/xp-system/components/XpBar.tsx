'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, Progress, Group, Text, Tooltip, ThemeIcon } from '@mantine/core';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { IconStar, IconTrophy } from '@tabler/icons-react';

interface XpBarProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
  levelName: string;
  badge: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Milestone positions (percentage)
const MILESTONES = [25, 50, 75, 100];

// Shimmer keyframes CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;

export function XpBar({
  currentXp,
  xpToNextLevel,
  level,
  levelName,
  badge,
  showLabel = true,
  size = 'md',
}: XpBarProps) {
  const percentage = xpToNextLevel > 0 ? (currentXp / xpToNextLevel) * 100 : 100;
  const progressSize = size === 'sm' ? 12 : size === 'md' ? 16 : 24;
  
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [displayXp, setDisplayXp] = useState(0);
  const prevXpRef = useRef(currentXp);

  // Animate progress bar fill
  useEffect(() => {
    const controls = animate(animatedPercentage, percentage, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAnimatedPercentage(v),
    });
    return controls.stop;
  }, [percentage]);

  // Animate XP counter
  useEffect(() => {
    const controls = animate(displayXp, currentXp, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayXp(Math.round(v)),
    });
    return controls.stop;
  }, [currentXp]);

  // Check if XP just increased
  const xpIncreased = currentXp > prevXpRef.current;
  useEffect(() => {
    prevXpRef.current = currentXp;
  }, [currentXp]);

  return (
    <Box>
      {/* Inject shimmer keyframes */}
      <style>{shimmerKeyframes}</style>
      
      {showLabel && (
        <Group justify="space-between" mb={6}>
          <Group gap="xs">
            <motion.div
              animate={xpIncreased ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Text size="xl">{badge}</Text>
            </motion.div>
            <div>
              <Text fw={600} size="sm">
                Lv.{level} {levelName}
              </Text>
            </div>
          </Group>
          <motion.div
            animate={xpIncreased ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Text size="sm" fw={500} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {displayXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
            </Text>
          </motion.div>
        </Group>
      )}

      <Tooltip
        label={`${currentXp.toLocaleString()} / ${xpToNextLevel.toLocaleString()} XP (${percentage.toFixed(1)}%)`}
        position="top"
      >
        <Box style={{ position: 'relative' }}>
          {/* Background track */}
          <Box
            style={{
              height: progressSize,
              borderRadius: progressSize / 2,
              background: 'linear-gradient(90deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Animated progress fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${animatedPercentage}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                backgroundSize: '200% 100%',
                borderRadius: progressSize / 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer effect overlay */}
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            </motion.div>

            {/* Milestone markers */}
            {MILESTONES.slice(0, -1).map((milestone) => (
              <motion.div
                key={milestone}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: animatedPercentage >= milestone ? 1 : 0.5,
                  opacity: animatedPercentage >= milestone ? 1 : 0.4,
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                }}
                style={{
                  position: 'absolute',
                  left: `${milestone}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: progressSize * 0.6,
                  height: progressSize * 0.6,
                  borderRadius: '50%',
                  background: animatedPercentage >= milestone 
                    ? '#FFD700' 
                    : 'rgba(255,255,255,0.5)',
                  border: '2px solid white',
                  boxShadow: animatedPercentage >= milestone 
                    ? '0 0 10px rgba(255,215,0,0.6)' 
                    : 'none',
                  zIndex: 10,
                }}
              />
            ))}
          </Box>

          {/* Level up indicator at 100% */}
          {percentage >= 95 && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                right: -8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <IconTrophy size={20} color="#FFD700" />
            </motion.div>
          )}
        </Box>
      </Tooltip>

      {/* XP gain indicator */}
      {xpIncreased && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            right: 0,
            top: -20,
          }}
        >
          <Text size="sm" fw={700} c="green">
            +XP!
          </Text>
        </motion.div>
      )}
    </Box>
  );
}

export default XpBar;

