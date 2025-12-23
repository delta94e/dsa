'use client';

import { useEffect, useRef } from 'react';

interface RemoteSvelteProps {
  remoteUrl?: string;
  children?: React.ReactNode;
}

/**
 * Provider that loads Svelte Web Components from remote
 */
export function RemoteSvelteProvider({ 
  remoteUrl = 'http://localhost:3005/dist/svelte-components.js',
  children 
}: RemoteSvelteProps) {
  useEffect(() => {
    // Check if already loaded
    if (customElements.get('svelte-widget')) {
      return;
    }

    // Load the Svelte components script
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.type = 'module';
    script.async = true;
    
    script.onerror = () => {
      console.error('Failed to load Svelte components from:', remoteUrl);
    };
    
    document.head.appendChild(script);
  }, [remoteUrl]);

  return <>{children}</>;
}

/**
 * Wrapper for svelte-widget custom element
 */
export function SvelteWidgetWrapper({ 
  title = 'Hello from Svelte!', 
  description = 'Web Component loaded from remote' 
}: { title?: string; description?: string }) {
  return (
    // @ts-expect-error - Custom element
    <svelte-widget title={title} description={description} />
  );
}

/**
 * Wrapper for svelte-counter custom element
 */
export function SvelteCounterWrapper({ 
  initialValue = 0, 
  step = 1,
  onCountChanged
}: { 
  initialValue?: number; 
  step?: number;
  onCountChanged?: (count: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleCountChanged = (e: CustomEvent<{ count: number }>) => {
      onCountChanged?.(e.detail.count);
    };

    element.addEventListener('countchanged', handleCountChanged as EventListener);
    
    return () => {
      element.removeEventListener('countchanged', handleCountChanged as EventListener);
    };
  }, [onCountChanged]);

  return (
    // @ts-expect-error - Custom element
    <svelte-counter 
      ref={ref} 
      initial-value={initialValue} 
      step={step} 
    />
  );
}

export default RemoteSvelteProvider;
