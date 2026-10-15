import {
  LayoutDashboard,
  Search,
  BookmarkCheck,
  Settings,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Overview',
    href: '/',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Search Repositories',
    href: '/search',
    icon: Search,
  },
  {
    name: 'Saved Repositories',
    href: '/saved',
    icon: BookmarkCheck,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
