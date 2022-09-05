import React, { FC } from "react";

import ReactSelect from "react-select";
import { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";
import clsx from "clsx"

interface ISelectInput extends StateManagerProps<{ value: string; label: string }, false> {}

const SelectInput: FC<ISelectInput> = ({ styles, className, ...props }) => {
  return (
    <ReactSelect //
      className={clsx(className, "my-2", "rs_is:hidden", "rs_c:bg-cyan-100", "rs_ml:relative")}
      classNamePrefix="rs"
      {...props}
    />
  );
};

export default SelectInput;
