'use client';

import { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════
// Feature Disabled Page Component
// Server-rendered, no Mantine dependencies for SSR safety
// ═══════════════════════════════════════════════════════════════
interface FeatureDisabledPageProps {
  featureName: string;
  title?: string;
  description?: string;
  alertMessage?: string;
  redirectHref?: string;
  redirectLabel?: string;
}

export function FeatureDisabledPage({
  featureName,
  title = 'Feature Disabled',
  description,
  alertMessage = 'Please check back later or contact support if you believe this is an error.',
  redirectHref = '/',
  redirectLabel = 'Go to Home Page',
}: FeatureDisabledPageProps) {
  const defaultDescription = `**${featureName}** is currently disabled by an administrator. This feature is not available at this time.`;

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
          {title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '16px',
            color: '#868e96',
            margin: '0 0 20px',
            lineHeight: 1.5,
          }}
          dangerouslySetInnerHTML={{ 
            __html: (description || defaultDescription).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }}
        />

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
            {alertMessage}
          </p>
        </div>

        {/* Button */}
        <a
          href={redirectHref}
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
          {redirectLabel}
        </a>
      </div>
    </div>
  );
}
