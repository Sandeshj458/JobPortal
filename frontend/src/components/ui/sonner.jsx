// import { useTheme } from "next-themes"
// import { Toaster as Sonner } from "sonner";

// const Toaster = ({
//   ...props
// }) => {
//   const { theme = "system" } = useTheme()

//   return (
//     (<Sonner
//       theme={theme}
//       className="toaster group"
//       style={
//         {
//           "--normal-bg": "var(--popover)",
//           "--normal-text": "var(--popover-foreground)",
//           "--normal-border": "var(--border)"
//         }
//       }
//       {...props} />)
//   );
// }

// export { Toaster }

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",

        // Global success toast styles
        "--success-bg": "#16a34a",       // green-600
        "--success-text": "#FFFFFF",     // green-100
        "--success-border": "#22c55e",   // green-500

        // Global error toast styles
        "--error-bg": "#dc2626",         // red-600
        "--error-text": "#FFFFFF",       // red-200
        "--error-border": "#ef4444",     // red-500
      }}
      {...props}
    />
  );
};

export { Toaster };
