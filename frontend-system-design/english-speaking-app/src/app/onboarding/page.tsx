'use client';

import { AppleInvitesOnboarding } from '@/shared/components/ui/AppleInvitesOnboarding';

// Showcase images - rooms/speaking practice themes
const showcaseImages = [
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800',  // People talking
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', // Group discussion
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',  // Business meeting
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', // Friends chatting
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', // Conference
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', // Team meeting
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800', // Travel discussion
];

export default function OnboardingDemoPage() {
    return (
        <AppleInvitesOnboarding
            images={showcaseImages}
            title="English Speaking App"
            subtitle="Chào mừng bạn đến với"
            description="Nâng cao kỹ năng nói tiếng Anh với hơn"
            highlightText="500+"
            buttonText="Khám phá ngay"
            buttonHref="/rooms"
            speed={25}
        />
    );
}
