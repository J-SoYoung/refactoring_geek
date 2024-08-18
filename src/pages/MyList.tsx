import React from "react";
import { useLocation, useParams } from "react-router-dom";
// import Cart from "../components/myPage/Cart";
import Layout from "../components/myPage/_Layout";
import OrderList from "../components/myPage/OrderList";
import { UserDataType } from "../types/usedType";
import MyCart from "../components/myPage/MyCart";

interface StateProps {
  user: UserDataType;
}

const MyList = () => {
  const { list } = useParams();
  const location = useLocation();
  const { user }: StateProps = location.state || {};

  return (
    <Layout title={list == "carts" ? "장바구니" : "주문내역"}>
      <div className="p-4">
        <h1>
          {list == "carts" ? (
            // <Cart carts={user.carts} />
            <MyCart />
          ) : (
            <OrderList orders={user.orders} />
          )}
        </h1>
      </div>
    </Layout>
  );
};

export default MyList;
