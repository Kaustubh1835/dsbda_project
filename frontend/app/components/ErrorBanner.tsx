"use client";

import { XCircle, X } from "lucide-react";

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <div className="error-banner" role="alert">
      <div className="flex items-start gap-4">
        <XCircle className="text-red-500 mt-0.5" size={20} />
        <div className="flex-1 min-w-0">
          <p className="error-banner-title">Prediction Failed</p>
          <p className="error-banner-message">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="error-banner-dismiss"
          aria-label="Dismiss error"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
