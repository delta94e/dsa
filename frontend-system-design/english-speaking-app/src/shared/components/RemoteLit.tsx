'use client';

import { useEffect, useRef } from 'react';

interface LitWidgetElement extends HTMLElement {
  title?: string;
  description?: string;
}

interface LitCounterElement extends HTMLElement {
  'initial-value'?: number;
  step?: number;
}

interface RemoteLitProps {
  remoteUrl?: string;
  children?: React.ReactNode;
}

/**
 * Provider that loads Lit components from remote
 */
export function RemoteLitProvider({ 
  remoteUrl = 'http://localhost:3003/dist/lit-components.js',
  children 
}: RemoteLitProps) {
  useEffect(() => {
    // Check if already loaded
    if (customElements.get('lit-widget')) {
      return;
    }

    // Load the Lit components script
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.type = 'module';
    script.async = true;
    
    script.onerror = () => {
      console.error('Failed to load Lit components from:', remoteUrl);
    };
    
    document.head.appendChild(script);

    return () => {
      // Don't remove - web components stay registered
    };
  }, [remoteUrl]);

  return <>{children}</>;
}

/**
 * Wrapper for lit-widget custom element
 */
export function LitWidgetWrapper({ 
  title = 'Hello from Lit!', 
  description = 'Web Component loaded from remote' 
}: { title?: string; description?: string }) {
  const ref = useRef<LitWidgetElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.title = title;
      ref.current.description = description;
    }
  }, [title, description]);

  return (
    // @ts-expect-error - Custom element
    <lit-widget ref={ref} title={title} description={description} />
  );
}

/**
 * Wrapper for lit-counter custom element
 */
export function LitCounterWrapper({ 
  initialValue = 0, 
  step = 1,
  onCountChanged
}: { 
  initialValue?: number; 
  step?: number;
  onCountChanged?: (count: number) => void;
}) {
  const ref = useRef<LitCounterElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleCountChanged = (e: CustomEvent<{ count: number }>) => {
      onCountChanged?.(e.detail.count);
    };

    element.addEventListener('count-changed', handleCountChanged as EventListener);
    
    return () => {
      element.removeEventListener('count-changed', handleCountChanged as EventListener);
    };
  }, [onCountChanged]);

  return (
    // @ts-expect-error - Custom element
    <lit-counter 
      ref={ref} 
      initial-value={initialValue} 
      step={step} 
    />
  );
}

export default RemoteLitProvider;
