import React, { forwardRef } from "react";
import cx from "classnames";
import { Icon, IconProps } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Typography";

export type TextAreaProps = Omit<
  JSX.IntrinsicElements["textarea"],
  "disabled" | "size"
> & {
  leftIconName?: IconProps["name"];
  rightIconName?: IconProps["name"];
  rightSymbol?: string;
  isDisabled?: boolean;
  errorMessage?: string;
  variant?: "regular" | "colored";
  leftSymbol?: string;
  helperText?: string;
  wrapperClassName?: string;
  inputClassName?: string;
};

const variantClasses = {
  regular: {
    container: "bg-neutral-200 focus-within:border focus-within:border-green",
    input: "bg-neutral-200",
  },
  colored: {
    container:
      "bg-white border border-neutral-400 focus-within:border focus-within:border-green",
    input: "bg-white",
  },
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      leftIconName,
      leftSymbol,
      rightIconName,
      rightSymbol,
      isDisabled,
      errorMessage,
      wrapperClassName,
      inputClassName,
      variant = "regular",
      helperText,
      ...rest
    },
    ref
  ) => {
    return (
      <div>
        <div
          className={cx(
            "group inline-flex items-center dark:bg-black dark:border dark:border-neutral-800 focus-within:dark:border-green rounded-sm transition-all border border-transparent ease-linear duration-200 gap-2 overflow-hidden",
            variantClasses[variant].container,
            wrapperClassName
          )}
        >
          <textarea
            disabled={isDisabled}
            className={cx(
              "block w-full rounded-sm pr-3 border-none focus:border-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed transition-all ease-linear duration-200",
              "text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-600 disabled:placeholder:text-neutral-400 text-ellipsis",
              "dark:bg-black",
              "text-basic-12-auto-regular",
              variantClasses[variant].input,
              inputClassName
            )}
            {...rest}
            ref={ref}
          />
        </div>
        {errorMessage && (
          <Text className="mt-1 text-basic-10-auto-regular text-accent-red">
            {errorMessage}
          </Text>
        )}
        {helperText && (
          <div
            className={cx("mt-1 flex items-center gap-1", {
              "text-neutral-400": isDisabled,
              "text-neutral-600": !isDisabled,
            })}
          >
            <Icon name="Info" size="sm" />
            <Text className="text-basic-10-auto-regular">{helperText}</Text>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
