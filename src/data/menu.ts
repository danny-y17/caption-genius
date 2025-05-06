import { MenuConfig } from '@/types/menu';
import { History, BarChart, Sparkles } from 'lucide-react';

export const menuConfig: MenuConfig = {
    authenticated: [
        {
            text: "Generate",
            url: "/caption",
            icon: Sparkles
        },
        {
            text: "History",
            url: "/history",
            icon: History
        },
        {
            text: "Analytics",
            url: "/analytics",
            icon: BarChart
        }
    ],
    unauthenticated: [],
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