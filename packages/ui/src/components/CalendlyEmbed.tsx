'use client';

import { useEffect, useState, useMemo } from 'react';

interface CalendlyEmbedProps {
  url: string;
  height?: number;
  hideGdprBanner?: boolean;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

export function CalendlyEmbed({
  url,
  height = 700,
  hideGdprBanner = true,
}: CalendlyEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState(height);

  const enhancedUrl = useMemo(() => {
    try {
      const urlObj = new URL(url);
      if (hideGdprBanner) {
        urlObj.searchParams.set('hide_gdpr_banner', '1');
      }
      urlObj.searchParams.set('embed_type', 'Inline');
      urlObj.searchParams.set('embed_domain', '1');
      return urlObj.toString();
    } catch {
      return url;
    }
  }, [url, hideGdprBanner]);

  // Listen for Calendly height events (auto-resize)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event === 'calendly.page_height') {
        setDynamicHeight(e.data.payload.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (window.Calendly) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isLoaded && window.Calendly) {
      const container = document.getElementById('calendly-container');
      if (container) {
        container.innerHTML = '';
        window.Calendly.initInlineWidget({
          url: enhancedUrl,
          parentElement: container,
        });
      }
    }
  }, [isLoaded, enhancedUrl]);

  return (
    <div
      id="calendly-container"
      data-testid="calendly-widget"
      className="calendly-inline-widget"
      data-url={enhancedUrl}
      data-resize="true"
      style={{
        minHeight: `${dynamicHeight}px`,
        width: '100%',
        overflow: 'hidden',
      }}
    />
  );
}
