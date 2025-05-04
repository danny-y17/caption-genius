import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    text: string;
    url: string;
    icon?: LucideIcon;
}

export interface MenuSection {
    title: string;
    items: Omit<MenuItem, 'icon'>[];
}

export interface MenuConfig {
    authenticated: MenuItem[];
    unauthenticated: MenuItem[];
    footer: MenuSection[];
}