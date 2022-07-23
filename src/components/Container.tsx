import React, { ComponentProps, FC, ReactNode } from "react";

import cn from "clsx";

interface IContainer extends ComponentProps<"div"> {}

const Container: FC<IContainer> = ({ children, className }) => {
  return <div className={cn(className, "px-4 w-full mx-auto md:px-6 lg:max-w-7xl")}>{children}</div>;
};

export default Container;
