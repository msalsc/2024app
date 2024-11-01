import type { AppRouter } from "@event-app/express-backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

export const APP_URL = "https://event-api.fly.dev";
export const WS_URL = "ws://event-api.fly.dev/trpc";

const trpc = createTRPCReact<AppRouter>();

export function TrpcWrapper({ children }) {
  const client = httpLink({
    url: `${APP_URL}/trpc`,
  });

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient, setTrpcClient] = useState(() =>
    trpc.createClient({
      links: [client],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

export { trpc as trpcClient };
