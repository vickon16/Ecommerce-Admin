"use client";

import { FC } from "react";
import { StoreModal } from "../modals/StoreModal";
import ClientOnly from "../ClientOnly";

interface ModalProviderProps {}

const ModalProvider: FC<ModalProviderProps> = ({}) => {

  return (
    <ClientOnly>
      <StoreModal />
    </ClientOnly>
  );
};

export default ModalProvider;
