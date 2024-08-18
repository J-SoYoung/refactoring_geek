import "./index.css";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import BottomNav from "./components/common/BottomNav";

function App() {
  const location = useLocation();
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Outlet />
          {location.pathname !== "/api/login" && <BottomNav />}
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}

export default App;
