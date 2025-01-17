import { Button } from "@nextui-org/react";
import { ReactNode } from "react";

interface ButtonActionProps {
  icon?: ReactNode;
  onPress: () => void;
  name: string;
}

export default function ButtonAction({
  icon,
  onPress,
  name,
}: ButtonActionProps) {
  return (
    <Button
      endContent={icon}
      className="text-white border-white/50 hover:scale-110 transition-all transform duration-500 ease-in-out"
      variant="bordered"
      onPress={onPress}
    >
      {name}
    </Button>
  );
}
