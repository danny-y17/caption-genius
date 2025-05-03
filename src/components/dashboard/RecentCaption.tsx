import { motion } from "framer-motion";
import { Copy, History } from "lucide-react";

interface RecentCaptionProps {
  text: string;
  niche: string;
  date: string;
  index: number;
}

export const RecentCaption: React.FC<RecentCaptionProps> = ({ text, niche, date, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
    >
      <div className="flex-1">
        <p className="text-foreground mb-1 font-medium">{text}</p>
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <span className="px-2 py-1 bg-primary/10 rounded-full text-primary font-medium">
            {niche}
          </span>
          <span>{date}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy caption">
          <Copy className="w-4 h-4 text-foreground/70" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View history">
          <History className="w-4 h-4 text-foreground/70" />
        </button>
      </div>
    </motion.div>
  );
}; 