import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Wordsmith from "./Wordsmith";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0,
    },
  },
});

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <Wordsmith />
      </QueryClientProvider>
  );
}