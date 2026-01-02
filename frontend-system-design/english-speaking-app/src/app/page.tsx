'use client';

import { motion } from 'framer-motion';
import {
    Container,
    Text,
    Button,
    SimpleGrid,
    Box,
    Group,
    Title,
    Divider,
    Avatar,
} from '@mantine/core';
import {
    IconWorld,
    IconRobot,
    IconUsers,
    IconVideo,
    IconMicrophone,
    IconMessageCircle,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandYoutube,
    IconShieldCheck,
    IconHeadphones,
    IconTrophy,
} from '@tabler/icons-react';
import Link from 'next/link';
import { UserMenu } from '@/shared/components/ui/UserMenu';
import { FeatureFlagMenu, useFlags } from '@/shared/components/ui/FeatureFlagMenu';
import { FloatingOrbs } from './_components/FloatingOrbs';
import { AnimatedHero } from './_components/AnimatedHero';
import { FeatureCard } from './_components/FeatureCard';
import { StatsCounter } from './_components/StatsCounter';
import { TestimonialCard } from './_components/TestimonialCard';

const features = [
    {
        icon: <IconVideo size={28} />,
        iconColor: '#1877F2',
        iconBg: '#E7F3FF',
        title: 'Video call chất lượng cao',
        description: 'Kết nối video HD mượt mà, hỗ trợ nhóm lên đến 12 người với âm thanh rõ ràng.',
    },
    {
        icon: <IconRobot size={28} />,
        iconColor: '#31A24C',
        iconBg: '#E6F4E7',
        title: 'AI Tutor thông minh',
        description: 'Luyện tập với AI 24/7, nhận phản hồi tức thì về phát âm và ngữ pháp.',
    },
    {
        icon: <IconUsers size={28} />,
        iconColor: '#E4405F',
        iconBg: '#FCE4E8',
        title: 'Phòng theo trình độ',
        description: 'Tìm phòng phù hợp từ A1 đến C2, học cùng người có trình độ tương đương.',
    },
    {
        icon: <IconTrophy size={28} />,
        iconColor: '#F7B928',
        iconBg: '#FFF4E0',
        title: 'Hệ thống XP & Cấp bậc',
        description: 'Kiếm điểm XP mỗi khi luyện tập, mở khóa huy hiệu và leo bảng xếp hạng.',
    },
    {
        icon: <IconHeadphones size={28} />,
        iconColor: '#6B5CE7',
        iconBg: '#EFEAFF',
        title: 'Chủ đề đa dạng',
        description: 'Từ giao tiếp hàng ngày đến phỏng vấn xin việc, IELTS, TOEIC.',
    },
    {
        icon: <IconShieldCheck size={28} />,
        iconColor: '#00A4BD',
        iconBg: '#E5F7F9',
        title: 'An toàn & Thân thiện',
        description: 'Cộng đồng được kiểm duyệt, môi trường học tập tích cực và hỗ trợ.',
    },
];

const testimonials = [
    {
        name: 'Nguyễn Minh Anh',
        avatar: 'https://i.pravatar.cc/150?img=10',
        country: 'Việt Nam 🇻🇳',
        level: 'B2',
        quote: 'Sau 3 tháng luyện tập mỗi ngày 30 phút, điểm IELTS Speaking của mình tăng từ 5.5 lên 7.0!',
    },
    {
        name: 'Park Ji-young',
        avatar: 'https://i.pravatar.cc/150?img=20',
        country: 'Hàn Quốc 🇰🇷',
        level: 'B1',
        quote: 'Tuyệt vời! Mình đã kết bạn với nhiều người từ khắp thế giới và tiếng Anh cải thiện rõ rệt.',
    },
    {
        name: 'Tanaka Yuki',
        avatar: 'https://i.pravatar.cc/150?img=30',
        country: 'Nhật Bản 🇯🇵',
        level: 'A2',
        quote: 'Ứng dụng thân thiện, dễ sử dụng. AI tutor giúp mình luyện tập khi không có partner.',
    },
];

export default function HomePage() {
    const flags = useFlags();

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: '#F0F2F5',
                position: 'relative',
            }}
        >
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'white',
                    borderBottom: '1px solid #E4E6EB',
                }}
            >
                <Container size="lg">
                    <Group justify="space-between" h={60}>
                        {/* Logo */}
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Group gap="xs">
                                <Box
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: 'linear-gradient(135deg, #1877F2, #0866FF)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconMicrophone size={24} color="white" />
                                </Box>
                                <Text
                                    fw={700}
                                    size="xl"
                                    style={{
                                        color: '#1C1E21',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    SpeakUp
                                </Text>
                            </Group>
                        </motion.div>

                        {/* Nav Links */}
                        <Group gap="xl" visibleFrom="sm">
                            {['Phòng luyện tập', 'Bảng xếp hạng', 'AI Tutor'].map((item) => (
                                <motion.div
                                    key={item}
                                    whileHover={{ y: -2 }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Text
                                        size="sm"
                                        fw={500}
                                        style={{
                                            color: '#65676B',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {item}
                                    </Text>
                                </motion.div>
                            ))}
                        </Group>

                        {/* Right Section */}
                        <Group gap="sm">
                            <FeatureFlagMenu />
                            <UserMenu />
                        </Group>
                    </Group>
                </Container>
            </motion.header>

            {/* Hero Section with Background */}
            <Box
                style={{
                    background: 'linear-gradient(180deg, white 0%, #F0F2F5 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <FloatingOrbs />
                <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <AnimatedHero showAIPractice={flags.ai_practice.enabled} />
                </Container>
            </Box>

            <Container size="lg" py="xl">
                {/* Stats Section */}
                <Box mt={-40} mb={60} style={{ position: 'relative', zIndex: 10 }}>
                    <StatsCounter />
                </Box>

                {/* Features Section */}
                <Box mb={80}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: 40 }}
                    >
                        <Title
                            order={2}
                            mb="sm"
                            style={{
                                color: '#1C1E21',
                                fontWeight: 700,
                            }}
                        >
                            Tại sao chọn SpeakUp?
                        </Title>
                        <Text size="lg" c="dimmed" maw={500} mx="auto">
                            Nền tảng luyện nói tiếng Anh số 1 Việt Nam với đầy đủ tính năng
                        </Text>
                    </motion.div>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {features.map((feature, index) => (
                            <FeatureCard key={feature.title} {...feature} index={index} />
                        ))}
                    </SimpleGrid>
                </Box>

                {/* Testimonials Section */}
                <Box mb={80}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: 40 }}
                    >
                        <Title
                            order={2}
                            mb="sm"
                            style={{ color: '#1C1E21', fontWeight: 700 }}
                        >
                            Học viên nói gì?
                        </Title>
                        <Text size="lg" c="dimmed">
                            Hàng nghìn người đã cải thiện tiếng Anh cùng SpeakUp
                        </Text>
                    </motion.div>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} index={index} />
                        ))}
                    </SimpleGrid>
                </Box>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        ta="center"
                        py={60}
                        px="xl"
                        style={{
                            background: 'linear-gradient(135deg, #1877F2 0%, #0866FF 100%)',
                            borderRadius: 24,
                        }}
                    >
                        <Title
                            order={2}
                            mb="md"
                            style={{ color: 'white', fontWeight: 700 }}
                        >
                            Sẵn sàng bắt đầu?
                        </Title>
                        <Text
                            size="lg"
                            mb="xl"
                            style={{ color: 'rgba(255,255,255,0.9)' }}
                            maw={400}
                            mx="auto"
                        >
                            Tham gia cùng hàng nghìn người học và bắt đầu nói tiếng Anh ngay hôm nay
                        </Text>

                        <Group justify="center" gap="md">
                            <Link href="/rooms" style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        style={{
                                            background: 'white',
                                            color: '#1877F2',
                                            fontWeight: 600,
                                            height: 52,
                                            padding: '0 32px',
                                        }}
                                    >
                                        Bắt đầu miễn phí
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        variant="outline"
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            color: 'white',
                                            fontWeight: 600,
                                            height: 52,
                                            padding: '0 32px',
                                        }}
                                    >
                                        Đăng nhập
                                    </Button>
                                </motion.div>
                            </Link>
                        </Group>
                    </Box>
                </motion.div>
            </Container>

            {/* Footer */}
            <Box
                component="footer"
                mt={80}
                py={40}
                style={{
                    background: 'white',
                    borderTop: '1px solid #E4E6EB',
                }}
            >
                <Container size="lg">
                    <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
                        {/* Logo & Description */}
                        <Box maw={300}>
                            <Group gap="xs" mb="md">
                                <Box
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        background: 'linear-gradient(135deg, #1877F2, #0866FF)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconMicrophone size={20} color="white" />
                                </Box>
                                <Text fw={700} size="lg" style={{ color: '#1C1E21' }}>
                                    SpeakUp
                                </Text>
                            </Group>
                            <Text size="sm" c="dimmed" lh={1.6}>
                                Nền tảng luyện nói tiếng Anh trực tuyến hàng đầu, 
                                kết nối người học từ khắp nơi trên thế giới.
                            </Text>
                        </Box>

                        {/* Links */}
                        <Group gap={60} align="flex-start">
                            <Box>
                                <Text fw={600} size="sm" mb="md" style={{ color: '#1C1E21' }}>
                                    Sản phẩm
                                </Text>
                                {['Phòng luyện tập', 'AI Tutor', 'Bảng xếp hạng', 'Nhiệm vụ'].map((item) => (
                                    <Text key={item} size="sm" c="dimmed" mb="xs" style={{ cursor: 'pointer' }}>
                                        {item}
                                    </Text>
                                ))}
                            </Box>
                            <Box>
                                <Text fw={600} size="sm" mb="md" style={{ color: '#1C1E21' }}>
                                    Hỗ trợ
                                </Text>
                                {['Trung tâm trợ giúp', 'Liên hệ', 'Điều khoản', 'Bảo mật'].map((item) => (
                                    <Text key={item} size="sm" c="dimmed" mb="xs" style={{ cursor: 'pointer' }}>
                                        {item}
                                    </Text>
                                ))}
                            </Box>
                        </Group>

                        {/* Social Links */}
                        <Box>
                            <Text fw={600} size="sm" mb="md" style={{ color: '#1C1E21' }}>
                                Theo dõi chúng tôi
                            </Text>
                            <Group gap="sm">
                                {[
                                    { icon: <IconBrandFacebook size={20} />, color: '#1877F2' },
                                    { icon: <IconBrandInstagram size={20} />, color: '#E4405F' },
                                    { icon: <IconBrandYoutube size={20} />, color: '#FF0000' },
                                ].map((social, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: '#F0F2F5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: social.color,
                                        }}
                                    >
                                        {social.icon}
                                    </motion.div>
                                ))}
                            </Group>
                        </Box>
                    </Group>

                    <Divider my="xl" color="#E4E6EB" />

                    <Text size="sm" c="dimmed" ta="center">
                        © 2024 SpeakUp. Made with ❤️ in Vietnam
                    </Text>
                </Container>
            </Box>
        </Box>
    );
}
