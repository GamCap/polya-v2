import { ReactNode, useEffect } from "react";
import cx from "classnames";
import { Button } from "../ui/Button";
import { Text } from "@/components/ui/Typography";

export type ModalProps = {
  isOpen: boolean;
  title?: string;
  panelClassName?: string;
  renderHeader?: ({ onClose }: Pick<ModalProps, "onClose">) => ReactNode;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  renderHeader,
  panelClassName,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-neutral-900 bg-opacity-70"
        onClick={onClose}
      />
      <div
        className={cx(
          "relative p-6 bg-white dark:bg-[#2C2C2C] rounded-md shadow-xl w-full max-w-lg mx-auto",
          panelClassName
        )}
      >
        {renderHeader?.({ onClose }) ?? (
          <div className="flex justify-between items-start">
            <Text className=" text-title-16-auto-medium lg:text-title-22-27-medium text-neutral-900 dark:text-white">
              {title}
            </Text>
            <Button
              iconName="Cross"
              size="small"
              variant="subtle"
              onClick={onClose}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
