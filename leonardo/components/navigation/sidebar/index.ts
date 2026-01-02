// Sidebar Navigation Components
// Re-exports UI components + custom navigation components

// Re-export all UI primitives from ui/Sidebar
export * from '@/components/ui/Sidebar';

// Custom Navigation Components (project-specific)
export { SidebarNavigation, default } from './SidebarNavigation';
export { SidebarNavItem } from './SidebarNavItem';
export { SidebarMenu as NavigationSidebarMenu } from './SidebarMenu'; // Renamed to avoid conflict with UI SidebarMenu
export { SidebarExpandedPanel } from './SidebarExpandedPanel';
export { ExpandedNavItem } from './ExpandedNavItem';
export { SocialLinksFooter } from './SocialLinksFooter';
export { MobileHeaderBar } from './MobileHeader';
export { MobileSidebarLayout } from './MobileSidebarLayout';
export { SidebarContent as NavigationSidebarContent } from './SidebarContent'; // Renamed to avoid conflict with UI SidebarContent
export { SidebarCloseButton } from '../../ui/Sidebar/SidebarCloseButton';
