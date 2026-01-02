'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { TokenIcon } from '@/components/icons/TokenIcon';

interface TokenDisplayProps {
  className?: string;
  tokens?: number;
}

/**
 * TokenDisplay
 * 
 * Displays the user's token/credit balance.
 */
export const TokenDisplay: FC<TokenDisplayProps> = ({
  className,
  tokens = 0,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        'px-3 py-1.5 rounded-xl',
        'bg-white/5',
        'text-sm font-medium text-white/70',
        className
      )}
    >
      <TokenIcon className="size-4 text-purple-400" />
      <span>{tokens.toLocaleString()}</span>
    </div>
  );
};

export default TokenDisplay;
