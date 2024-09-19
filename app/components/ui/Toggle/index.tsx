import React, { useState } from "react";
import cx from "classnames";

type ToggleProps = {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Toggle = ({ label, checked = false, onChange }: ToggleProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div className="flex items-center gap-2 ">
      <div
        className={cx(
          "relative inline-flex items-center h-4 w-7 rounded-full cursor-pointer transition-colors prevent-select",
          isChecked
            ? " bg-green-primary dark:bg-green-primary-dark"
            : " bg-accent-light-green dark:bg-[#67988F]"
        )}
        onClick={handleToggle}
      >
        <div
          className={cx(
            "inline-block h-3 w-3 rounded-full bg-white dark:bg-black transition-transform",
            isChecked
              ? "translate-x-3.5"
              : "translate-x-0.5 dark:bg-neutral-300"
          )}
        />
      </div>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
};
