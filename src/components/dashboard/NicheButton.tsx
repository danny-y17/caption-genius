import { motion } from "framer-motion";

interface NicheButtonProps {
  niche: string;
  onClick: () => void;
}

export const NicheButton: React.FC<NicheButtonProps> = ({ niche, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-4 bg-white rounded-xl shadow-md border border-gray-100 text-center hover:bg-gray-50 transition-colors font-medium text-foreground"
    >
      {niche}
    </motion.button>
  );
}; 