"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { useEffect } from "react";

export default function SetUpPage() {
  const { onOpen, isOpen } = useStoreModal((state) => state);

  useEffect(() => {
    if (!isOpen) onOpen()
  }, [isOpen, onOpen]);

  return null;
}
