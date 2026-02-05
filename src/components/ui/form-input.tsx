import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  icon?: LucideIcon;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
  autoComplete,
  className = '',
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-foreground/60" />
        )}
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`${Icon ? 'pl-10' : ''} text-foreground bg-white/50 backdrop-blur-sm border-gray-200/50`}
          required={required}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );
}; 