import { MenuConfig } from '@/types/menu';
import { Home, Calendar, History, LogOut, Sparkles } from 'lucide-react';

export const menuConfig: MenuConfig = {
    authenticated: [
        {
            text: "Home",
            url: "/dashboard",
            icon: Home
        },
        {
            text: "Generate",
            url: "/caption",
            icon: Sparkles
        },
        {
            text: "Calendar",
            url: "/calendar",
            icon: Calendar
        },
        {
            text: "History",
            url: "/history",
            icon: History
        }
    ],
    unauthenticated: [
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Pricing",
            url: "/pricing"
        },
        {
            name: "Login",
            url: "/login"
        }
    ],
    footer: [
        {
            title: "Product",
            items: [
                { text: "Features", url: "/features" },
                { text: "Demo", url: "/demo" },
                { text: "Updates", url: "/updates" }
            ]
        },
        {
            title: "Company",
            items: [
                { text: "About", url: "/about" },
                { text: "Blog", url: "/blog" },
                { text: "Careers", url: "/careers" },
                { text: "Contact", url: "/contact" }
            ]
        },
        {
            title: "Resources",
            items: [
                { text: "Documentation", url: "/docs" },
                { text: "Help Center", url: "/help" },
                { text: "API", url: "/api" },
                { text: "Status", url: "/status" }
            ]
        },
        {
            title: "Legal",
            items: [
                { text: "Privacy", url: "/privacy" },
                { text: "Terms", url: "/terms" },
                { text: "Security", url: "/security" }
            ]
        }
    ]
};