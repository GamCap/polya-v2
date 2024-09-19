import React, { forwardRef, ReactNode, useId } from "react";
import cx from "classnames";
import { Text } from "@/components/ui/Typography";
export type CheckboxProps = JSX.IntrinsicElements["input"] & {
  wrapperClassName?: string;
  renderLabel?: () => ReactNode;
  className?: string;
  label?: string;
  labelClassName?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      renderLabel,
      labelClassName = "text-basic-12-regular",
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const id = useId();
    return (
      <label
        className={cx("flex items-center prevent-select", wrapperClassName)}
      >
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className={cx(
            "w-4 h-4 text-green-primary bg-transparent rounded-sm border border-neutral-500 focus:ring-0 checked:border-green-primary ",
            className
          )}
          {...props}
        />
        {renderLabel?.() ??
          (label && (
            <Text
              as="label"
              htmlFor={id}
              className={cx("ml-2", labelClassName)}
            >
              {label}
            </Text>
          ))}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
