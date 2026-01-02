'use client';

import { useState, useCallback } from 'react';
import { Box, Text, UnstyledButton } from '@mantine/core';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const DURATION = 0.4;
const ICON_SIZE = 30;
const LINE_HEIGHT = 2;

const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phòng học', href: '/rooms' },
    { label: 'Nhiệm vụ', href: '/quests' },
    { label: 'Hồ sơ', href: '/profile' },
];

// ═══════════════════════════════════════════════════════════════
// Hamburger Icon Component
// ═══════════════════════════════════════════════════════════════
interface HamburgerIconProps {
    isOpen: boolean;
}

function HamburgerIcon({ isOpen }: HamburgerIconProps) {
    return (
        <Box
            style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 6,
                position: 'relative',
            }}
        >
            {/* Top line - becomes part of X */}
            <motion.div
                animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 8 : 0,
                    width: isOpen ? ICON_SIZE : ICON_SIZE,
                }}
                transition={{ duration: DURATION, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    height: LINE_HEIGHT,
                    background: isOpen ? '#353535' : '#666',
                    borderRadius: 1,
                    transformOrigin: 'center',
                }}
            />
            
            {/* Middle line - fades away */}
            <motion.div
                animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? 20 : 0,
                }}
                transition={{ duration: DURATION * 0.5 }}
                style={{
                    width: ICON_SIZE * 0.67,
                    height: LINE_HEIGHT,
                    background: '#666',
                    borderRadius: 1,
                }}
            />
            
            {/* Bottom line - becomes part of X */}
            <motion.div
                animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -8 : 0,
                    width: isOpen ? ICON_SIZE : ICON_SIZE * 0.45,
                }}
                transition={{ duration: DURATION, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    height: LINE_HEIGHT,
                    background: isOpen ? '#353535' : '#666',
                    borderRadius: 1,
                    transformOrigin: 'center',
                    alignSelf: 'flex-end',
                }}
            />
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Diagonal Navigation Component
// ═══════════════════════════════════════════════════════════════
interface DiagonalNavProps {
    logoSrc?: string;
    onNavigate?: (href: string) => void;
}

export function DiagonalNav({ 
    logoSrc = 'https://ui8.s3.amazonaws.com/v5/assets/global/touch-icon-ipad-retina.png',
    onNavigate,
}: DiagonalNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const controls = useAnimation();

    const toggleMenu = useCallback(async () => {
        setIsOpen(prev => !prev);
    }, []);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        if (onNavigate) {
            onNavigate(href);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <UnstyledButton
                onClick={toggleMenu}
                style={{
                    position: 'fixed',
                    top: 40,
                    right: 40,
                    zIndex: 1000,
                    padding: 8,
                    transform: 'rotate(-45deg)',
                }}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: DURATION }}
                >
                    <HamburgerIcon isOpen={isOpen} />
                </motion.div>
            </UnstyledButton>

            {/* Full Screen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DURATION }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 900,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Background Color */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: DURATION * 0.1 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: '#2F8BE6',
                            }}
                        />

                        {/* Diagonal Stripes */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                transform: 'rotate(-35deg)',
                                transformOrigin: 'center',
                            }}
                        >
                            {/* Top Stripe */}
                            <motion.div
                                initial={{ height: 0, y: 0 }}
                                animate={{ height: '150vh', y: '-25%' }}
                                exit={{ height: 0, y: 0 }}
                                transition={{ 
                                    duration: DURATION,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                                style={{
                                    width: '300vw',
                                    marginLeft: '-100vw',
                                    background: '#353535',
                                }}
                            />
                            
                            {/* Bottom Stripe */}
                            <motion.div
                                initial={{ height: 0, y: 0 }}
                                animate={{ height: '150vh', y: '25%' }}
                                exit={{ height: 0, y: 0 }}
                                transition={{ 
                                    duration: DURATION,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                                style={{
                                    width: '300vw',
                                    marginLeft: '-100vw',
                                    background: '#353535',
                                }}
                            />
                        </Box>

                        {/* Menu Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ 
                                duration: DURATION,
                                delay: DURATION * 0.5,
                            }}
                            style={{
                                position: 'relative',
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '100vh',
                                gap: 32,
                            }}
                        >
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ 
                                        delay: DURATION * 0.5 + index * 0.1,
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                >
                                    <Link 
                                        href={item.href}
                                        style={{ textDecoration: 'none' }}
                                        onClick={() => handleNavClick(item.href)}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, x: 10 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Text
                                                size="xl"
                                                fw={700}
                                                style={{
                                                    color: '#353535',
                                                    fontSize: 24,
                                                }}
                                            >
                                                {item.label}
                                            </Text>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Logo */}
                        <motion.img
                            src={logoSrc}
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.3 }}
                            transition={{ 
                                duration: DURATION,
                                delay: DURATION * 0.3,
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 40,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 80,
                                height: 80,
                                objectFit: 'contain',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// Simpler Hamburger Menu (dark theme variant)
// ═══════════════════════════════════════════════════════════════
interface SlideNavProps {
    items?: { label: string; href: string }[];
    position?: 'left' | 'right';
}

export function SlideNav({ 
    items = navItems,
    position = 'right',
}: SlideNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Toggle Button */}
            <UnstyledButton
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: 24,
                    [position]: 24,
                    zIndex: 1000,
                    padding: 12,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <HamburgerIcon isOpen={isOpen} />
            </UnstyledButton>

            {/* Slide Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 800,
                            }}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: position === 'right' ? '100%' : '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: position === 'right' ? '100%' : '-100%' }}
                            transition={{ 
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                bottom: 0,
                                [position]: 0,
                                width: 300,
                                background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)',
                                borderLeft: position === 'right' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                borderRight: position === 'left' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                zIndex: 900,
                                padding: 24,
                                paddingTop: 100,
                            }}
                        >
                            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link 
                                            href={item.href}
                                            style={{ textDecoration: 'none' }}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Box
                                                p="md"
                                                style={{
                                                    borderRadius: 12,
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <Text
                                                    size="lg"
                                                    fw={500}
                                                    style={{ color: 'white' }}
                                                >
                                                    {item.label}
                                                </Text>
                                            </Box>
                                        </Link>
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// Floating Action Button Menu
// ═══════════════════════════════════════════════════════════════
interface FABMenuItem {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: string;
}

interface FABMenuProps {
    items: FABMenuItem[];
    mainIcon?: React.ReactNode;
}

export function FABMenu({ items, mainIcon = '+' }: FABMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
            }}
        >
            {/* Menu Items */}
            <AnimatePresence>
                {isOpen && (
                    <Box
                        style={{
                            position: 'absolute',
                            bottom: 70,
                            right: 0,
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            gap: 12,
                            alignItems: 'flex-end',
                        }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                transition={{
                                    delay: index * 0.05,
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 20,
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                <motion.span
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    style={{
                                        background: 'rgba(0,0,0,0.8)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: 8,
                                        fontSize: 14,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {item.label}
                                </motion.span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={item.onClick}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: item.color || 'linear-gradient(135deg, #667eea, #764ba2)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {item.icon}
                                </motion.button>
                            </motion.div>
                        ))}
                    </Box>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                animate={{ rotate: isOpen ? 45 : 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontSize: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                }}
            >
                {mainIcon}
            </motion.button>
        </Box>
    );
}

export default DiagonalNav;
