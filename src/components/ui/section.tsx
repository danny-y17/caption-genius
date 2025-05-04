'use client';

import { cn } from '@/lib/utils';
import { Container } from './container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gray';
}

export const Section = ({ children, className, variant = 'default', ...props }: SectionProps) => {
  return (
    <section
      className={cn(
        'py-24',
        variant === 'gray' && 'bg-gray-50',
        className
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}; 