'use client';

import { ReactNode } from 'react';

interface CaptionsLayoutProps {
  children: ReactNode;
}

export default function CaptionsLayout({ children }: CaptionsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 