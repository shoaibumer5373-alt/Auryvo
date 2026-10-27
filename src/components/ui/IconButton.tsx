import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn('icon-button', 'disabled:opacity-40', className)}
      {...props}
    />
  );
}
