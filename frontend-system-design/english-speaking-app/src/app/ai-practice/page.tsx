import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AIPracticeContent } from './AIPracticeContent';

// Force dynamic rendering (uses cookies)
export const dynamic = 'force-dynamic';

// Server-side feature flag check
async function checkFeatureFlag(): Promise<boolean> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  
  try {
    // Get cookies from request to forward to API
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ');
    
    const response = await fetch(`${API_URL}/feature-flags/ai_practice/check`, {
      headers: {
        Cookie: cookieHeader,
      },
      // Cache for 5 seconds max to allow near real-time updates
      next: { revalidate: 5 },
    });
    
    if (!response.ok) {
      // If API fails, default to enabled
      console.warn('Feature flag check failed, defaulting to enabled');
      return true;
    }
    
    const data = await response.json();
    return data.enabled;
  } catch (error) {
    // If fetch fails, default to enabled
    console.error('Feature flag fetch error:', error);
    return true;
  }
}

// Feature Disabled Page Component (server-rendered)
function FeatureDisabledPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '450px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1b1e',
            margin: '0 0 12px',
          }}
        >
          Feature Disabled
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '16px',
            color: '#868e96',
            margin: '0 0 20px',
            lineHeight: 1.5,
          }}
        >
          <strong>AI Practice Mode</strong> is currently disabled by an administrator.
          This feature is not available at this time.
        </p>

        {/* Alert Box */}
        <div
          style={{
            background: '#fff4e6',
            border: '1px solid #ffc078',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#d9480f',
              margin: 0,
            }}
          >
            Please check back later or contact support if you believe this is an error.
          </p>
        </div>

        {/* Button */}
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #228be6 0%, #15aabf 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go to Home Page
        </a>
      </div>
    </div>
  );
}

// Server Component - checks feature flag before rendering
export default async function AIPracticePage() {
  const isEnabled = await checkFeatureFlag();
  
  // If feature is disabled, show disabled page immediately (no flash)
  if (!isEnabled) {
    return <FeatureDisabledPage />;
  }
  
  // Feature is enabled - render client component
  return <AIPracticeContent initialEnabled={isEnabled} />;
}
