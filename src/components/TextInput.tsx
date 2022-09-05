import React, { ComponentProps, FC } from "react";

import clsx from "clsx"
import { useField } from "formik";

interface ITextInput extends ComponentProps<"input"> {
  label: string;
  name: string;
}

const TextInput: FC<ITextInput> = ({ className, name, label, ...props }) => {
  const [input, meta] = useField(name);

  const displayError = meta.touched && meta.error;

  return (
    <label className={clsx("py-4 flex flex-col text-xl lg:max-w-[400px]", className)}>
      <p className="text-gray-800 mb-2 font-bold">{label}</p>

      <input className="border border-gray-200 p-3 rounded-lg" {...input} {...props} />

      {displayError && <p className="text-red-500 text-base mt-2">{meta.error}</p>}
    </label>
  );
};

export default TextInput;
