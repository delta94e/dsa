'use client';

import { type FC, type ReactNode } from 'react';
import { SidebarMenu } from './SidebarMenu';
import { SidebarExpandedPanel } from './SidebarExpandedPanel';
import { usePathname } from 'next/navigation';

// Types
interface SidebarContentProps {
  closeElement?: ReactNode;
}

/**
 * SidebarContent
 * 
 * The main content area of the sidebar containing navigation items.
 */
export const SidebarContent: FC<SidebarContentProps> = ({
  closeElement,
}) => {
  const pathname = usePathname() ?? '';

  return (
    <div className="flex h-full flex-col">
      {/* Close button (mobile) */}
      {closeElement && (
        <div className="flex items-center justify-end p-4">
          {closeElement}
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarMenu pathname={pathname} />
      </div>

      {/* Footer section could go here */}
    </div>
  );
};

export default SidebarContent;
