"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Group,
  Button,
  SegmentedControl,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconTarget,
  IconTrophy,
  IconSparkles,
  IconPlus,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";

import { PrivateRoute } from "@/features/auth";
import {
  GoalCard,
  QuestFlipCard,
  AnimatedCounter,
  ProgressIndicator,
} from "@/shared/components/ui/FlipCard";
import {
  MorphingAddButton,
  MorphingAddButtonDark,
  CompactMorphingButton,
} from "@/shared/components/ui/MorphingAddButton";
import { UserMenu } from "@/shared/components/ui/UserMenu";

// Demo data
const goals = [
  { icon: "🎸", name: "Mua Guitar", saved: 1200, goal: 3500 },
  { icon: "✈️", name: "Du lịch Nhật Bản", saved: 2800, goal: 5000 },
  { icon: "💻", name: "Laptop mới", saved: 800, goal: 2500 },
  { icon: "📚", name: "Khóa học IELTS", saved: 500, goal: 1500 },
];

const quests = [
  {
    icon: "🎯",
    name: "Hoàn thành 5 phòng",
    description: "Tham gia và hoàn thành 5 phòng nói chuyện",
    progress: 3,
    target: 5,
    xpReward: 100,
    completed: false,
  },
  {
    icon: "🔥",
    name: "Streak 7 ngày",
    description: "Học liên tục 7 ngày không nghỉ",
    progress: 7,
    target: 7,
    xpReward: 200,
    completed: true,
  },
  {
    icon: "💬",
    name: "Nói 100 phút",
    description: "Nói chuyện tổng cộng 100 phút",
    progress: 45,
    target: 100,
    xpReward: 150,
    completed: false,
  },
  {
    icon: "⭐",
    name: "Nhận 10 lượt thích",
    description: "Được các thành viên khác thích",
    progress: 8,
    target: 10,
    xpReward: 75,
    completed: false,
  },
];

export default function AnimationsShowcasePage() {
  const [activeTab, setActiveTab] = useState("morphing");

  return (
    <PrivateRoute>
      <Box
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)",
        }}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(15, 15, 26, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Container size="lg">
            <Group justify="space-between" h={70}>
              <Group gap="md">
                <Link href="/" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="subtle"
                      leftSection={<IconArrowLeft size={16} />}
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Trang chủ
                    </Button>
                  </motion.div>
                </Link>
                <Group gap="xs">
                  <Box
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #FA75BB, #667eea)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSparkles size={22} color="white" />
                  </Box>
                  <Title order={3} style={{ color: "white" }}>
                    Animations Demo
                  </Title>
                </Group>
              </Group>
              <UserMenu />
            </Group>
          </Container>
        </motion.header>

        <Container size="lg" py="xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Box
              ta="center"
              mb="xl"
              p="xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: 24,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text
                size="sm"
                mb="xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Inspired by React Native Moti/Reanimated
              </Text>
              <Title order={2} mb="md" style={{ color: "white" }}>
                Flip Card Animations
              </Title>
              <Text
                style={{ color: "rgba(255,255,255,0.7)" }}
                maw={600}
                mx="auto"
              >
                Nhấp vào các card để xem animation flip 3D với perspective. Mỗi
                card có thể hiển thị thông tin chi tiết ở mặt sau.
              </Text>
            </Box>
          </motion.div>

          {/* Stats Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
              {[
                {
                  label: "Tổng tiết kiệm",
                  value: 5300,
                  prefix: "$",
                  color: "#34C759",
                },
                {
                  label: "Mục tiêu",
                  value: 12500,
                  prefix: "$",
                  color: "#FF9500",
                },
                {
                  label: "Hoàn thành",
                  value: 75,
                  suffix: "%",
                  color: "#FA75BB",
                },
                {
                  label: "XP kiếm được",
                  value: 2450,
                  suffix: " XP",
                  color: "#667eea",
                },
              ].map((stat, i) => (
                <Box
                  key={stat.label}
                  p="lg"
                  ta="center"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 16,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Text
                    size="xs"
                    mb={4}
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {stat.label}
                  </Text>
                  <Text size="xl" fw={700} style={{ color: stat.color }}>
                    <AnimatedCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1.5}
                    />
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </motion.div>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box
              mb="xl"
              p="md"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <SegmentedControl
                value={activeTab}
                onChange={setActiveTab}
                fullWidth
                size="md"
                radius="xl"
                data={[
                  {
                    value: "morphing",
                    label: (
                      <Group gap={6} justify="center">
                        <IconPlus size={16} />
                        <span>Morphing</span>
                      </Group>
                    ),
                  },
                  {
                    value: "goals",
                    label: (
                      <Group gap={6} justify="center">
                        <IconTarget size={16} />
                        <span>Goals</span>
                      </Group>
                    ),
                  },
                  {
                    value: "quests",
                    label: (
                      <Group gap={6} justify="center">
                        <IconTrophy size={16} />
                        <span>Quests</span>
                      </Group>
                    ),
                  },
                ]}
                styles={{
                  root: {
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                  },
                  indicator: {
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                  },
                  label: {
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                    "&[data-active]": {
                      color: "white",
                    },
                  },
                }}
              />
            </Box>
          </motion.div>

          {/* Content */}
          {activeTab === "morphing" && (
            <Box>
              <Text
                size="sm"
                mb="xl"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                💡 Nhấp vào các button để xem animation morphing Plus → Check
              </Text>

              {/* Morphing Button Section */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
                {/* Light Theme */}
                <Box
                  p="xl"
                  ta="center"
                  style={{
                    background: "#F7F6F6",
                    borderRadius: 24,
                  }}
                >
                  <Text size="sm" mb="md" c="dimmed">
                    Light Theme - Original Style
                  </Text>
                  <Box style={{ display: "flex", justifyContent: "center" }}>
                    <MorphingAddButton
                      size={180}
                      topLabel="Add to"
                      bottomLabel="Library"
                      doneLabel="Done"
                    />
                  </Box>
                </Box>

                {/* Dark Theme */}
                <Box
                  p="xl"
                  ta="center"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 24,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Text
                    size="sm"
                    mb="md"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Dark Theme - Gradient Style
                  </Text>
                  <Box style={{ display: "flex", justifyContent: "center" }}>
                    <MorphingAddButtonDark
                      size={180}
                      topLabel="Tham gia"
                      bottomLabel="Phòng"
                      doneLabel="Đã vào"
                    />
                  </Box>
                </Box>
              </SimpleGrid>

              {/* Compact Buttons */}
              <Box
                p="xl"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 24,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Text fw={600} mb="lg" style={{ color: "white" }}>
                  Compact Button Variants
                </Text>
                <Group gap="md" wrap="wrap">
                  <CompactMorphingButton label="Thêm bạn" doneLabel="Đã thêm" />
                  <CompactMorphingButton
                    label="Theo dõi"
                    doneLabel="Đang theo dõi"
                    width={180}
                  />
                  <CompactMorphingButton
                    label="Yêu thích"
                    doneLabel="Đã thích"
                    width={150}
                  />
                  <CompactMorphingButton
                    label="Lưu"
                    doneLabel="Đã lưu"
                    width={120}
                  />
                </Group>
              </Box>
            </Box>
          )}

          {activeTab === "goals" && (
            <Stack gap="md">
              <Text size="sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                💡 Nhấp vào card để xem tiến độ chi tiết
              </Text>
              {goals.map((goal, index) => (
                <GoalCard
                  key={goal.name}
                  icon={goal.icon}
                  name={goal.name}
                  saved={goal.saved}
                  goal={goal.goal}
                  index={index}
                />
              ))}
            </Stack>
          )}

          {activeTab === "quests" && (
            <Stack gap={0}>
              <Text
                size="sm"
                mb="md"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                💡 Nhấp vào card để xem tiến độ chi tiết
              </Text>
              {quests.map((quest, index) => (
                <QuestFlipCard
                  key={quest.name}
                  icon={quest.icon}
                  name={quest.name}
                  description={quest.description}
                  progress={quest.progress}
                  target={quest.target}
                  xpReward={quest.xpReward}
                  completed={quest.completed}
                  index={index}
                />
              ))}
            </Stack>
          )}

          {/* Progress Indicator Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Box
              mt="xl"
              p="xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: 24,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text fw={600} mb="lg" style={{ color: "white" }}>
                Progress Indicators Demo
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                <Box>
                  <Text
                    size="sm"
                    mb="sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Beginner (25%)
                  </Text>
                  <ProgressIndicator percentage={25} color="#34C759" />
                </Box>
                <Box>
                  <Text
                    size="sm"
                    mb="sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Intermediate (65%)
                  </Text>
                  <ProgressIndicator percentage={65} color="#FF9500" />
                </Box>
                <Box>
                  <Text
                    size="sm"
                    mb="sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Advanced (95%)
                  </Text>
                  <ProgressIndicator percentage={95} color="#FA75BB" />
                </Box>
              </SimpleGrid>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </PrivateRoute>
  );
}
