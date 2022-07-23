import React, { ComponentProps, FC } from "react";

import cn from "clsx";

interface IButton extends ComponentProps<"button"> {
  variant: "filled" | "empty";
}

const Button: FC<IButton> = ({ variant, className, children, ...props }) => {
  return (
    <button //
      className={cn(
        className,
        "rounded-lg py-2 px-4 min-w-[100px]",
        variant === "filled" && "bg-black text-white",
        variant === "empty" && "border-2 border-black"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
