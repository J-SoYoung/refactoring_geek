import "./index.css";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import BottomNav from "./components/common/BottomNav";
import { signInWithGoogle, signOutFromGoogle } from "./api/apis_auth";
import { useAuth } from "./hook/useAuth";

function App() {
  // const location = useLocation();
  // const queryClient = new QueryClient();
  const { user, loading } = useAuth();

  const onClickLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const onClickLogout = async () => {
    try {
      await signOutFromGoogle();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Outlet />
          {location.pathname !== "/api/login" && <BottomNav />}
        </RecoilRoot>
      </QueryClientProvider> */}

      <div>
        {user ? (
          <div>
            <h1>Welcome, {user.displayName}</h1>
            <button onClick={onClickLogout}>LogOut</button>
          </div>
        ) : (
          <button onClick={onClickLogin}>Login</button>
        )}
      </div>
    </>
  );
}

export default App;
