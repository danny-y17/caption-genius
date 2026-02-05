'use client';

import { cn } from '@/lib/utils/cn';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'lead';
  align?: 'left' | 'center' | 'right';
}

const textStyles = {
  default: 'text-base',
  muted: 'text-foreground/60',
  lead: 'text-lg sm:text-xl',
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Text = ({
  children,
  className,
  variant = 'default',
  align = 'left',
  ...props
}: TextProps) => {
  return (
    <p
      className={cn(
        textStyles[variant],
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}; 