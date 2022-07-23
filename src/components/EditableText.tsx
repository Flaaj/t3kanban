import React, {
  FC,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import cn from "clsx";
import { useField, useFormikContext } from "formik";
import { trpc } from "src/utils/trpc";

interface IEditableText {
  name: string;
  tag: "p" | "h3" | "h4";
  variant: "input" | "textarea";
  children: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
}

const EditableText: FC<IEditableText> = ({ name, className, tag, variant, type = "text", children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditting, setIsEditting] = useState(false);

  const [input] = useField(name);
  const form = useFormikContext();

  const props = {
    className,
    onDoubleClick: () => {
      setIsEditting((isEdditing) => !isEdditing);
    },
  };
  const inputProps = {
    type,
    onKeyDown: (e: KeyboardEvent) => {
      if (!e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        form.handleSubmit();
        setIsEditting(false);
      }
    },
    ...input,
  };

  useEffect(() => {
    if (isEditting) {
      inputRef.current?.focus();
      textAreaRef.current?.focus();
    }
  }, [isEditting]);

  if (isEditting) {
    if (variant === "input") {
      return <input ref={inputRef} {...props} {...inputProps} />;
    }
    if (variant === "textarea") {
      return <textarea ref={textAreaRef} {...props} {...inputProps} rows={12} className={cn(className, "px-2")} />;
    }
  }

  if (tag === "h3") {
    return <h3 {...props}>{children}</h3>;
  }
  if (tag === "h4") {
    return <h4 {...props}>{children}</h4>;
  }
  if (tag === "p") {
    return <p {...props}>{children}</p>;
  }

  return null;
};

export default EditableText;
