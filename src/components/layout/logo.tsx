import { AspectRatio } from "../ui/aspect-ratio";

export const Logo: React.FC = () => {
  return (
    <AspectRatio ratio={1 / 1}>
      <svg viewBox="0 0 208 167" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M74 25C74 11.1929 85.1929 0 99 0H141C154.807 0 166 11.1929 166 25V51.664L207.114 75.4012L166 99.1383V142C166 155.807 154.807 167 141 167H25C11.1929 167 0 155.807 0 142V72H74V25Z"
          fill="currentColor"
        />
      </svg>
    </AspectRatio>
  );
};
