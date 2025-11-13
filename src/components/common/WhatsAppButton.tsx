import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/1234567890?text=Hi!%20I%20need%20help%20with%20NEP%20System", "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-24 md:bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg z-50 flex items-center gap-2 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="p-4">
        <MessageCircle className="w-6 h-6" />
      </div>
      <span className="pr-4 font-semibold hidden group-hover:inline">Suporte</span>
    </motion.button>
  );
};
