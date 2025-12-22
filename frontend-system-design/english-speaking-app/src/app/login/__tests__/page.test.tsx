import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import LoginPage from '../page';
import { useAuthStore } from '@/stores/authStore';

// Mock the auth store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Wrapper component with MantineProvider
const renderWithProviders = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockCheckAuth = jest.fn();

  beforeEach(() => {
    mockLogin.mockClear();
    mockCheckAuth.mockResolvedValue(undefined);

    // Default mock implementation
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: jest.fn(),
      checkAuth: mockCheckAuth,
      setUser: jest.fn(),
    });

    // Mock getState for redirect check
    (useAuthStore as any).getState = () => ({
      isAuthenticated: false,
    });
  });

  describe('Rendering', () => {
    it('should render the login page with title', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(screen.getByText('SpeakUp')).toBeInTheDocument();
      });
    });

    it('should render the tagline', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(
          screen.getByText('Practice English Speaking with Real People & AI')
        ).toBeInTheDocument();
      });
    });

    it('should render feature list', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(screen.getByText('Join voice rooms with learners worldwide')).toBeInTheDocument();
        expect(screen.getByText('Practice with AI conversation partner')).toBeInTheDocument();
        expect(screen.getByText('Real-time voice chat with reactions')).toBeInTheDocument();
      });
    });

    it('should render Google sign in button', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
      });
    });

    it('should render Continue as Guest button', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Continue as Guest/i })).toBeInTheDocument();
      });
    });

    it('should render demo badge', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/i)).toBeInTheDocument();
      });
    });

    it('should render terms text', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/By signing in, you agree to our Terms of Service/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('should call login when Google button is clicked', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        const googleButton = screen.getByRole('button', { name: /Sign in with Google/i });
        fireEvent.click(googleButton);
      });

      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it('should check auth on mount', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(mockCheckAuth).toHaveBeenCalled();
      });
    });
  });

  describe('Authentication State', () => {
    it('should not render content when already authenticated', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', name: 'Test', email: 'test@example.com' } as any,
        isAuthenticated: true,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        checkAuth: mockCheckAuth,
        setUser: jest.fn(),
      });

      (useAuthStore as any).getState = () => ({
        isAuthenticated: true,
      });

      renderWithProviders(<LoginPage />);

      // Should return null when authenticated
      await waitFor(() => {
        expect(screen.queryByText('SpeakUp')).not.toBeInTheDocument();
      });
    });
  });

  describe('Guest Navigation', () => {
    it('should have guest button linked to home', async () => {
      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        const guestButton = screen.getByRole('button', { name: /Continue as Guest/i });
        const link = guestButton.closest('a');
        expect(link).toHaveAttribute('href', '/');
      });
    });
  });
});
