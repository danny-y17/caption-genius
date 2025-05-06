'use client';

import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const gapStyles = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const colsStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export const Grid = ({
  children,
  className,
  cols = 3,
  gap = 'md',
  ...props
}: GridProps) => {
  return (
    <div
      className={cn(
        'grid',
        colsStyles[cols],
        gapStyles[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 