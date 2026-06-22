// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";
// import { Toaster } from "react-hot-toast";

// export function Providers({ children }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000,
//             refetchOnWindowFocus: false,
//             retry: 1,
//           },
//         },
//       }),
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#363636",
//             color: "#fff",
//           },
//           success: {
//             style: {
//               background: "#22c55e",
//             },
//           },
//           error: {
//             style: {
//               background: "#ef4444",
//             },
//           },
//         }}
//       />
//     </QueryClientProvider>
//   );
// }

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 0, // Don't retry failed queries in demo mode
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
