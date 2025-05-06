import React from 'react';
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  index: number;
  iconClass: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, change, icon: Icon, index, iconClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-start"
    >
      <div className="mb-2">
        {React.createElement(Icon, { className: iconClass })}
      </div>
      <div className="text-2xl font-bold mb-1 text-foreground">{value}</div>
      <div className="text-sm text-foreground/70 mb-1">{label}</div>
      <div className="text-xs font-medium text-green-600">
        {change} from last month
      </div>
    </motion.div>
  );
}; 