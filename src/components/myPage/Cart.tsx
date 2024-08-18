import React, { useState } from "react";
import MyUsedItemList from "./MyUsedItemList";
import { Link } from "react-router-dom";
import { Product } from "../../api/setting_firebase";
import { makeArr } from "../../types/utils";

interface CartsProps {
  carts: Product[];
}

const Cart = ({ carts }: CartsProps) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const cartsArr = makeArr(carts);
  console.log(cartsArr);

  // ⭕함수 동작X -> 구현해야함 ( 수량변경 )
  const handleQuantityChange = (cartId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-10 text-left">
      {cartsArr.length == 0 && (
        <div>
          <p>장바구니가 비었습니다</p>
          <Link to={"/"}>제품 구경하러 홈으로 이동!</Link>
        </div>
      )}

      <div>
        orders랑 비슷하게 에러 날거같아서 일단 주석처리해놨어요 cart업데이트
        되면 렌더링부분 수정할게요 콘솔에 데이터 확인만 일단 ㅎㅎ
      </div>
      {/* <div className="text-m text-gray-600 mb-4 pb-4 border-b">
        <span className="font-bold">전체 {cartItems.length}</span>
      </div>
      {!carts ? (
        <div>
          장바구니 내역이 없습니다.
          <p>
            <Link to="/">제품 구경하러 홈으로 이동</Link>
          </p>
        </div>
      ) : (
        carts.map((cart, idx) => {
          return (
            <MyUsedItemList
              key={idx}
              item={cart}
              isCart={true}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          );
        })
      )}
      {carts && (
        <>
          <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center text-center">
            <div className="flex flex-col ">
              <span>상품 총액</span>
              <span>
                {cartItems
              .reduce(
                (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
                0
              )
              .toLocaleString()}
                원
              </span>
            </div>
            <p> + </p>
            <div className="flex flex-col ">
              <span>배송비</span>
              <span>3,000원</span>
            </div>
            <p> = </p>
            <div className="flex flex-col font-bold">
              <span>총 금액</span>
              <span>
                {(
              cartItems.reduce(
                (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
                0
              ) + 3000
            ).toLocaleString()}
                원
              </span>
            </div>
          </div>
          <button className="w-full py-2 my-10 bg-[#8F5BBD] text-white rounded">
            주문하기
          </button>
        </>
      )} */}
    </div>
  );
};

export default Cart;
