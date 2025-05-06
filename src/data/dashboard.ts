import { Sparkles, MessageSquare, Clock, TrendingUp } from "lucide-react";

export const stats = [
  {
    label: "Captions Generated",
    value: "1,234",
    change: "+12.5%",
    icon: Sparkles,
    iconClass: "w-5 h-5 text-primary",
    positive: true,
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    change: "+2.3%",
    icon: TrendingUp,
    iconClass: "w-5 h-5 text-secondary",
    positive: true,
  },
  {
    label: "Time Saved",
    value: "32h",
    change: "+8.2%",
    icon: Clock,
    iconClass: "w-5 h-5 text-accent",
    positive: true,
  },
  {
    label: "Active Niches",
    value: "12",
    change: "+3",
    icon: MessageSquare,
    iconClass: "w-5 h-5 text-surface-light",
    positive: true,
  },
];

// Render like: <Stat.icon className={Stat.iconClass} />

export const recentCaptions = [
  {
    text: "✨ Transform your morning routine with our premium coffee blend...",
    niche: "Coffee Shop",
    date: "2h ago",
  },
  {
    text: "🧘‍♀️ Find your inner peace with our new yoga class series...",
    niche: "Yoga Studio",
    date: "5h ago",
  },
  {
    text: "💇‍♀️ Book your summer glow-up today! Limited slots available...",
    niche: "Salon",
    date: "1d ago",
  },
];

export const popularNiches = [
  "Yoga Studio",
  "Coffee Shop",
  "Fitness Trainer",
  "Photography",
  "Hair Salon",
  "Food Blogger",
  "Fashion Brand",
  "Wellness Center",
];
