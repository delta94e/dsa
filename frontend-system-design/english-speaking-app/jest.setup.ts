import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
    usePathname: () => '/',
}));

// Mock window.location
const mockLocation = {
    href: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
});
