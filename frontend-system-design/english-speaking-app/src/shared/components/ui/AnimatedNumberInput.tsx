'use client';

import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, TextInput, TextInputProps } from '@mantine/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// Helper function to format number with commas
// ═══════════════════════════════════════════════════════════════
interface FormattedChar {
    value: string;
    key: string;
    type: 'digit' | 'comma' | 'decimal';
}

function formatNumberWithCommas(
    formatter: Intl.NumberFormat,
    num: number
): FormattedChar[] {
    const formattedNum = formatter.format(num);
    const result: FormattedChar[] = [];
    let commaCount = 0;
    let decimalCount = 0;

    for (let i = 0; i < formattedNum.length; i++) {
        const char = formattedNum[i];
        
        if (char === ',' || char === ' ') {
            result.push({ value: char, key: `comma-${i}`, type: 'comma' });
            commaCount++;
        } else if (char === '.') {
            result.push({ value: char, key: `decimal-${i}`, type: 'decimal' });
            decimalCount++;
        } else {
            result.push({ 
                value: char, 
                key: `digit-${i - commaCount - decimalCount}`, 
                type: 'digit' 
            });
        }
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════
// Animated Digit Component
// ═══════════════════════════════════════════════════════════════
interface AnimatedDigitProps {
    char: FormattedChar;
    fontSize: number;
    color: string;
    fontWeight: number;
    duration: number;
}

function AnimatedDigit({ char, fontSize, color, fontWeight, duration }: AnimatedDigitProps) {
    return (
        <motion.span
            layout
            initial={{ y: fontSize / 2, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -fontSize / 2, opacity: 0 }}
            transition={{
                duration: duration / 1000,
                layout: { duration: duration / 1000 },
            }}
            style={{
                display: 'inline-block',
                fontSize,
                color,
                fontWeight,
                fontVariantNumeric: 'tabular-nums',
            }}
        >
            {char.value}
        </motion.span>
    );
}

// ═══════════════════════════════════════════════════════════════
// Animated Number Input Component
// ═══════════════════════════════════════════════════════════════
interface AnimatedNumberInputProps {
    value?: number;
    initialValue?: number;
    onChange?: (value: number) => void;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    animationDuration?: number;
    showGradients?: boolean;
    gradientColor?: string;
    formatter?: Intl.NumberFormat;
    editable?: boolean;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function AnimatedNumberInput({
    value: controlledValue,
    initialValue = 0,
    onChange,
    fontSize = 64,
    color = 'white',
    fontWeight = 700,
    animationDuration = 300,
    showGradients = true,
    gradientColor = 'black',
    formatter = new Intl.NumberFormat('en-US'),
    editable = true,
    prefix = '',
    suffix = '',
    className,
}: AnimatedNumberInputProps) {
    const [internalValue, setInternalValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const value = controlledValue ?? internalValue;

    const formattedNumbers = useMemo(() => {
        return formatNumberWithCommas(formatter, value);
    }, [value, formatter]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value.replace(/[^0-9.-]/g, '')) || 0;
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    return (
        <Box
            className={className}
            style={{
                position: 'relative',
                height: fontSize * 1.2,
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Animated Numbers Display */}
            <Box
                onClick={() => editable && inputRef.current?.focus()}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    cursor: editable ? 'text' : 'default',
                }}
            >
                {/* Prefix */}
                {prefix && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            fontSize,
                            color,
                            fontWeight,
                            marginRight: 4,
                        }}
                    >
                        {prefix}
                    </motion.span>
                )}

                {/* Digits */}
                <LayoutGroup>
                    <AnimatePresence mode="popLayout">
                        {formattedNumbers.map((char) => (
                            <AnimatedDigit
                                key={char.key}
                                char={char}
                                fontSize={fontSize}
                                color={color}
                                fontWeight={fontWeight}
                                duration={animationDuration}
                            />
                        ))}
                    </AnimatePresence>
                </LayoutGroup>

                {/* Suffix */}
                {suffix && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            fontSize: fontSize * 0.6,
                            color,
                            fontWeight,
                            marginLeft: 8,
                            opacity: 0.7,
                        }}
                    >
                        {suffix}
                    </motion.span>
                )}
            </Box>

            {/* Hidden Input */}
            {editable && (
                <input
                    ref={inputRef}
                    type="number"
                    value={value}
                    onChange={handleChange}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'text',
                    }}
                />
            )}

            {/* Top Gradient */}
            {showGradients && (
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: fontSize / 3,
                        background: `linear-gradient(to bottom, ${gradientColor}, transparent)`,
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Bottom Gradient */}
            {showGradients && (
                <Box
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: fontSize / 3,
                        background: `linear-gradient(to top, ${gradientColor}, transparent)`,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Animated Counter Display (Read-only variant)
// ═══════════════════════════════════════════════════════════════
interface AnimatedCounterDisplayProps {
    value: number;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    duration?: number;
    formatter?: Intl.NumberFormat;
    prefix?: string;
    suffix?: string;
    showGradients?: boolean;
    gradientColor?: string;
}

export function AnimatedCounterDisplay({
    value,
    fontSize = 48,
    color = 'white',
    fontWeight = 700,
    duration = 300,
    formatter = new Intl.NumberFormat('en-US'),
    prefix = '',
    suffix = '',
    showGradients = false,
    gradientColor = 'black',
}: AnimatedCounterDisplayProps) {
    return (
        <AnimatedNumberInput
            value={value}
            fontSize={fontSize}
            color={color}
            fontWeight={fontWeight}
            animationDuration={duration}
            formatter={formatter}
            prefix={prefix}
            suffix={suffix}
            editable={false}
            showGradients={showGradients}
            gradientColor={gradientColor}
        />
    );
}

// ═══════════════════════════════════════════════════════════════
// XP Counter (Game-style variant)
// ═══════════════════════════════════════════════════════════════
interface XPCounterProps {
    value: number;
    previousValue?: number;
    showDelta?: boolean;
}

export function XPCounter({ value, previousValue, showDelta = true }: XPCounterProps) {
    const [showPlus, setShowPlus] = useState(false);
    const delta = previousValue !== undefined ? value - previousValue : 0;

    useEffect(() => {
        if (delta > 0) {
            setShowPlus(true);
            const timer = setTimeout(() => setShowPlus(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [value, delta]);

    return (
        <Box style={{ position: 'relative', display: 'inline-block' }}>
            <AnimatedCounterDisplay
                value={value}
                fontSize={32}
                color="#FFD700"
                suffix=" XP"
                formatter={new Intl.NumberFormat('en-US')}
            />
            
            {/* Delta indicator */}
            <AnimatePresence>
                {showDelta && showPlus && delta > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -20, scale: 1 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: -40,
                            color: '#4ade80',
                            fontWeight: 700,
                            fontSize: 18,
                        }}
                    >
                        +{delta}
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Timer Display (Countdown variant)
// ═══════════════════════════════════════════════════════════════
interface TimerDisplayProps {
    seconds: number;
    fontSize?: number;
    color?: string;
    showHours?: boolean;
}

export function TimerDisplay({
    seconds,
    fontSize = 48,
    color = 'white',
    showHours = false,
}: TimerDisplayProps) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formatPart = (n: number) => n.toString().padStart(2, '0');

    const timeString = showHours
        ? `${formatPart(hours)}:${formatPart(minutes)}:${formatPart(secs)}`
        : `${formatPart(minutes)}:${formatPart(secs)}`;

    const chars: FormattedChar[] = timeString.split('').map((char, i) => ({
        value: char,
        key: char === ':' ? `colon-${i}` : `digit-${i}`,
        type: char === ':' ? 'decimal' : 'digit',
    }));

    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
            }}
        >
            <LayoutGroup>
                <AnimatePresence mode="popLayout">
                    {chars.map((char) => (
                        <AnimatedDigit
                            key={char.key}
                            char={char}
                            fontSize={fontSize}
                            color={color}
                            fontWeight={700}
                            duration={200}
                        />
                    ))}
                </AnimatePresence>
            </LayoutGroup>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Currency Input (Payment variant)
// ═══════════════════════════════════════════════════════════════
interface CurrencyInputProps {
    value?: number;
    onChange?: (value: number) => void;
    currency?: string;
    locale?: string;
}

export function CurrencyInput({
    value: controlledValue,
    onChange,
    currency = 'USD',
    locale = 'en-US',
}: CurrencyInputProps) {
    const [internalValue, setInternalValue] = useState(0);
    const value = controlledValue ?? internalValue;

    const formatter = useMemo(() => 
        new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), 
        [locale]
    );

    const currencySymbol = currency === 'USD' ? '$' : currency === 'VND' ? '₫' : currency;

    return (
        <AnimatedNumberInput
            value={value}
            onChange={(v) => {
                setInternalValue(v);
                onChange?.(v);
            }}
            fontSize={72}
            color="white"
            fontWeight={700}
            prefix={currencySymbol}
            formatter={formatter}
            showGradients={true}
            gradientColor="#1a1a2e"
            editable={true}
        />
    );
}

export default AnimatedNumberInput;
