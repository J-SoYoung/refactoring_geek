import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import UsedHome from "./pages/UsedHome.tsx";
import MyPage from "./pages/MyPage.tsx";
import UsedPostUpload from "./pages/UsedPostUpload.tsx";
import MyList from "./pages/MyList.tsx";
import MySalelist from "./pages/MySalelist.tsx";
import MyProfile from "./pages/MyProfile.tsx";
import UsedDetail from "./pages/UsedDetail.tsx";
import ProductsDtail from "./pages/ProductsDtail.tsx";
import NewProduct from "./pages/NewProduct.tsx";
import Products from "./pages/Products.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Payment from "./pages/Payment.tsx";
import OrdersDetail from "./pages/OrdersDetail.tsx";
import UsedMessageList from "./pages/UsedMessageList.tsx";
import UsedMessage from "./pages/UsedMessage.tsx";
import MyCart from "./components/myPage/MyCart.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      // { path: "/:keyword", element: <Home /> },
      // { path: "/products/new", element: <NewProduct /> },
      // { path: "/products", element: <Products /> },
      // { path: "/wishlist", element: <Wishlist /> },
      // { path: "/products/detail/:id", element: <ProductsDtail /> },
      { path: "/api/login", element: <Login /> },
      // { path: "/usedHome", element: <UsedHome /> },
      // { path: "/usedHome/detail/:itemId", element: <UsedDetail /> },
      // { path: "/usedPostUpload", element: <UsedPostUpload /> },
      // { path: "/my/:userId", element: <MyPage /> },
      // { path: "/my/:userId/salelist", element: <MySalelist /> },
      // { path: "/my/:userId/:list", element: <MyList /> },
      // { path: "/my/:userId/profile", element: <MyProfile /> },
      // { path: "/my/:userId/messageList", element: <UsedMessageList /> },
      // { path: "/my/:userId/carts", element: <MyCart /> },
      // { path: "/message/:itemId/:userId", element: <UsedMessage /> },
      // { path: "/payment/:id", element: <Payment /> },
      // { path: "/orders/detail/:ordersid", element: <OrdersDetail /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
