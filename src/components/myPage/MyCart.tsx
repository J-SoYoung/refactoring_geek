import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../../api/firebase";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms/userAtom";
import CartItem from "./CartItem";
import PriceCard from "./PriceCard";
import TotalPlusIcon from "../../assets/icons/totalPlus.svg";
import EqualsIcon from "../../assets/icons/totalEquals.svg";

export interface CartProducts {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string;
  quantity: number;
}

export default function MyCart() {
  // const queryClient = useQueryClient();
  const user = useRecoilValue(userState);
  const userId = user?.uid;
  const { isLoading, data: carts } = useQuery<CartProducts[], Error>({
    queryKey: ["carts", userId || ""],
    queryFn: () => {
      if (userId) {
        return getCart(userId);
      }
      return Promise.reject(new Error("User ID is undefined"));
    },
    enabled: !!userId,
  });
  {
    isLoading && <p>Loading..</p>;
  }

  const SHIPPING = 3000;
  const totalPrice: number =
    carts?.reduce(
      (prev, current) => prev + parseInt(current.price) * current.quantity,
      0
    ) || 0;

  return (
    <div className="container w-[600px]">
      <div className="flex justify-center mt-[80px] mb-[10px]">
        <h1 className="text-3xl font-bold text-left mb-[20px]">장바구니</h1>
      </div>
      <div className="flex text-lg gap-1 text-left px-11 mb-[10px]">
        <p className="font-bold mr-[5px]">전체</p>
        <p className="text-[#BEBEBE]">{carts?.length}</p>
      </div>
      <p className="border border-[#D9D9D9] w-[520px] m-auto mt-[20px] mb-[30px]"></p>
      <ul className="px-11 py-2 pb-4">
        {carts &&
          carts.map((product) => (
            <CartItem key={product.id} carts={product} /* uid={uid} */ />
          ))}
      </ul>
      <p className="border border-[#D9D9D9] w-[520px] m-auto mt-[30px] mb-[45px]"></p>
      <div className="flex justify-between items-center mb-10 px-2 md:px-8">
        <PriceCard text="상품 총액" price={totalPrice} />
        <img src={TotalPlusIcon} alt="TotalPlusIcon" />
        <PriceCard text="배송액" price={SHIPPING} />
        <img src={EqualsIcon} alt="EqualsIcon" />
        <PriceCard text="총가격" price={totalPrice + SHIPPING} />
      </div>
      <button className="w-[520px] mb-[100px] mt-[10px] py-3 bg-[#8F5BBD] text-[#fff] border border-[#8F5BBD] rounded-md hover:bg-[#fff] hover:text-[#8F5BBD] duration-200">
        주문하기
      </button>
    </div>
  );
}
