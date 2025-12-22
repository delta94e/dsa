'use client';

import { createTheme, MantineColorsTuple } from '@mantine/core';

const brandColors: MantineColorsTuple = [
    '#e8f5ff',
    '#d0e8ff',
    '#a1cfff',
    '#6fb3ff',
    '#4599ff',
    '#2d87ff',
    '#1a75ff',
    '#0062e6',
    '#0056cc',
    '#004ab3',
];

export const theme = createTheme({
    primaryColor: 'brand',
    colors: {
        brand: brandColors,
    },
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headings: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontWeight: '600',
    },
    radius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
    },
    components: {
        Button: {
            defaultProps: {
                radius: 'xl',
            },
        },
        Card: {
            defaultProps: {
                radius: 'lg',
                withBorder: true,
            },
        },
        Badge: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});
