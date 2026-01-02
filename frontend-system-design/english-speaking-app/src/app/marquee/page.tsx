'use client';

import { Box } from '@mantine/core';
import { MarqueeHero } from '@/shared/components/ui/MarqueeHero';

// Extended mock images
const heroImages = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker6',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker7',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker8',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker10',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker11',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker12',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker13',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker14',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker15',
];

export default function MarqueeDemoPage() {
    return (
        <Box style={{ minHeight: '100vh' }}>
            <MarqueeHero 
                images={heroImages}
                subtitle="Luyện nói tiếng Anh với người bản xứ và học viên từ khắp nơi trên thế giới. Tham gia các phòng học ngay!"
                buttonText="Khám phá phòng học"
                buttonHref="/rooms"
            />
        </Box>
    );
}
