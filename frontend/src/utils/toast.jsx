import { toast } from "sonner";

const successIcon = (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const errorIcon = (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// export const showSuccessToast = (message) => {
//   toast.success(message, {
//     icon: successIcon,
//     className:
//       "bg-success-bg text-success-text font-semibold shadow-lg rounded-md border border-success-border",
//   });
// };

// export const showErrorToast = (message) => {
//   toast.error(message, {
//     icon: errorIcon,
//     className:
//       "bg-error-bg text-error-text font-semibold shadow-lg rounded-md border border-error-border",
//   });
// };

export const showSuccessToast = (message) => {
  toast.success(message, {
    icon: successIcon,
    style: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success-text)',
      border: '1px solid var(--success-border)',
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '0.375rem',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    icon: errorIcon,
    style: {
      backgroundColor: 'var(--error-bg)',
      color: 'var(--error-text)',
      border: '1px solid var(--error-border)',
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '0.375rem',
    },
  });
};
