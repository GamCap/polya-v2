import { forwardRef } from "react";

export type DropdownProps = Omit<
  JSX.IntrinsicElements["select"],
  "disabled"
> & {
  optionClassName?: string;
  options: { label: string; value: string }[];
  extraOption?: { label: string; value: string };
  disabled?: boolean;
};

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ options, optionClassName, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        {...rest}
        className="group inline-flex items-center bg-neutral-200 dark:bg-black dark:border dark:border-neutral-800 rounded-sm transition-all border border-transparent ease-linear duration-200 gap-2 focus:ring-0 focus:border-0 text-basic-10-auto-regular"
      >
        {rest.extraOption && (
          <option
            key={rest.extraOption.value}
            value={rest.extraOption.value}
            className={optionClassName}
          >
            {rest.extraOption.label}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={optionClassName}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Dropdown.displayName = "Dropdown";
