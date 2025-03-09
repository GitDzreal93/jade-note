'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the BytemdViewer to prevent SSR issues
const BytemdViewer = dynamic(
  () => import('./BytemdViewer'),
  { ssr: false }
);

interface ClientBytemdViewerProps {
  content: string;
  className?: string;
}

export default function ClientBytemdViewer({ content, className = '' }: ClientBytemdViewerProps) {
  return <BytemdViewer content={content} className={className} />;
}
