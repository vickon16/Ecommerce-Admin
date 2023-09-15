"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import ClientOnly from "../ClientOnly";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  return (
    <ClientOnly>
      <Modal
        title="Are you sure you want to delete this?"
        description="This action cannot be undone."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button disabled={loading} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
        </div>
      </Modal>
    </ClientOnly>
  );
};
