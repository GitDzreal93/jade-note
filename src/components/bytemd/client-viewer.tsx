'use client';

import * as React from "react";
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
  return (
    <div className={className}>
      <BytemdViewer body={content} />
    </div>
  );
};

export default ClientBytemdViewer;
