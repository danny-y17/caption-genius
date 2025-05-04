'use client';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionTitle = ({ title, subtitle, className }: SectionTitleProps) => {
  return (
    <div className={cn('text-center mb-12', className)}>
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <Text variant="muted" className="max-w-2xl mx-auto">
          {subtitle}
        </Text>
      )}
    </div>
  );
}; 