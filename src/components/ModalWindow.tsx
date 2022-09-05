import React, { ComponentProps, createContext, FC, useContext, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import clsx from "clsx"
import Image from "next/image";
import closeIcon from "src/assets/vector/close-icon.svg";

interface IModalWindow extends ComponentProps<"div"> {
  isOpen: boolean;
  handleClose: () => void;
  shouldCloseOnBackgroundClick?: boolean;
}

export const ModalContext = createContext({ closeModal: () => {} });

const ModalWindow: FC<IModalWindow> = ({
  isOpen,
  handleClose,
  children,
  className,
  shouldCloseOnBackgroundClick = true,
}) => {
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const modalRoot = document.body

    const container = document.createElement("div");
    containerRef.current = container;

    modalRoot.appendChild(container);
    return () => {
      modalRoot.removeChild(container);
    };
  }, []);

  const contextValue = useMemo(() => ({ closeModal: () => handleClose() }), [handleClose]);

  const onBackgroundClick = () => {
    if (shouldCloseOnBackgroundClick) {
      handleClose();
    }
  };

  const onCloseButtonClick = () => {
    handleClose();
  };

  return isOpen
    ? createPortal(
        <ModalContext.Provider value={contextValue}>
          <div
            className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-cyan-900"
            onClick={onBackgroundClick}
          >
            <div
              className={clsx(className, "p-4 bg-white border border-gray-200 rounded-lg")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex">
                <button className="ml-auto w-6 h-6 rounded" onClick={onCloseButtonClick} title="Zamknij okno">
                  <Image src={closeIcon} width="20" height="20" alt="" />
                </button>
              </div>

              {children}
            </div>
          </div>
        </ModalContext.Provider>,
        document.body
      )
    : null;
};
export default ModalWindow;
