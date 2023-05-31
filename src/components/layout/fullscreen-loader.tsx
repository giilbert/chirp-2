import { motion } from "framer-motion";
import { FileQuestionIcon } from "lucide-react";

const AnimatedLogoIcon = motion(FileQuestionIcon);

export const FullscreenLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AnimatedLogoIcon
        initial={{ scale: 3 }}
        animate={{
          scale: 4,
          transition: {
            duration: 10,
          },
        }}
      />
    </div>
  );
};
