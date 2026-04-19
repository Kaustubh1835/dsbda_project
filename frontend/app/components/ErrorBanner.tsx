"use client";

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <div className="error-banner" role="alert">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="error-banner-title">Prediction Failed</p>
          <p className="error-banner-message">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="error-banner-dismiss"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
