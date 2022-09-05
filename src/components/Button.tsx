import React, { ComponentProps, FC } from "react";

import clsx from "clsx";

interface IButton extends ComponentProps<"button"> {
  variant: "filled" | "empty";
}

const Button: FC<IButton> = ({ variant, className, children, ...props }) => {
  return (
    <button //
      className={clsx(
        className,
        "rounded-lg py-2 px-4 min-w-[100px] transition",
        variant === "filled" && "bg-black text-white hover:bg-opacity-90",
        variant === "empty" && "border-2 border-black hover:border-opacity-60 "
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
