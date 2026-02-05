import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return (
            <label
                className={cn(
                    'block text-base font-medium mb-2 text-foreground',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Label.displayName = 'Label';

export { Label }; 
