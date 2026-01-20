"use client";

import React from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 mb-4">
          <span className="material-symbols-outlined text-red-400 text-[32px]">
            warning
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

        {/* Message */}
        <p className="text-white/60 text-sm mb-2">{message}</p>

        {/* Item Name */}
        {itemName && (
          <p className="text-white font-medium bg-white/10 px-4 py-2 rounded-lg mb-6">
            {itemName}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 w-full mt-4">
          <Button
            variant="glass"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1 !bg-red-500 hover:!bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
