'use client';

import * as React from "react";
import { useEffect, useRef } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the BytemdViewer to prevent SSR issues
const BytemdViewer = dynamic(
  () => import('./viewer').then(mod => mod.BytemdViewer),
  { ssr: false }
);

interface ClientBytemdViewerProps {
  content: string;
  className?: string;
}

export const ClientBytemdViewer = ({ content, className = '' }: ClientBytemdViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add a post-processing step to ensure h1 headings render correctly
  useEffect(() => {
    if (!containerRef.current) return;

    // Give the BytemdViewer time to render
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      // Find all h1 elements and apply proper styling
      const h1Elements = container.querySelectorAll('h1');
      h1Elements.forEach((h1) => {
        // Apply strong styling to ensure h1 is properly rendered
        h1.style.fontSize = '2em';
        h1.style.fontWeight = 'bold';
        h1.style.marginTop = '1.5em';
        h1.style.marginBottom = '0.8em';
        h1.style.borderBottom = '1px solid #eaecef';
        h1.style.paddingBottom = '0.3em';
        h1.style.display = 'block';
        
        // Add a class to make it easier to target with CSS
        h1.classList.add('bytemd-h1');
        
        // Ensure the content is visible
        h1.style.visibility = 'visible';
        h1.style.opacity = '1';
      });
    }, 100); // Wait for rendering to complete

    return () => clearTimeout(timer);
  }, [content]); // Re-run when content changes

  return (
    <div className={className} ref={containerRef}>
      <BytemdViewer body={content} />
    </div>
  );
};

export default ClientBytemdViewer;
