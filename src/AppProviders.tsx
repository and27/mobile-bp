import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};
export const AppProviders = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SafeAreaProvider>
  );
};
