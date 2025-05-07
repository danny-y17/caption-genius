'use client';

import { cn } from '@/lib/utils/cn';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  align?: 'left' | 'center' | 'right';
}

const headingStyles = {
  h1: 'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight',
  h2: 'text-3xl sm:text-4xl font-bold tracking-tight',
  h3: 'text-2xl sm:text-3xl font-bold',
  h4: 'text-xl sm:text-2xl font-semibold',
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Heading = ({
  children,
  className,
  variant = 'h2',
  align = 'left',
  ...props
}: HeadingProps) => {
  const Component = variant;
  return (
    <Component
      className={cn(
        headingStyles[variant],
        alignStyles[align],
        'text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}; 