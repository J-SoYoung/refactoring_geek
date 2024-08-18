import React from "react";
import { useLocation } from "react-router-dom";

interface getOrderDetails {
  ordersId?: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
  items: testProduct;
}
interface testProduct {
  title: string;
  description: string;
  price: string;
  image: string;
  options: string[];
  quantity: number;
}

export default function OrdersDetail() {
  const location = useLocation();
  const { orders } = location.state as { orders: getOrderDetails };
  const items = orders.items;
  const totalPrice = Number(items.price) + 3000;

  if (orders.paymentMethod === "creditcard") {
    orders.paymentMethod = "카드결제";
  } else if (orders.paymentMethod === "cash") {
    orders.paymentMethod = "계좌이체";
  } else if (orders.paymentMethod === "pay") {
    orders.paymentMethod = "페이결제";
  }

  return (
    <div className="container w-[600px]">
      <div className="flex justify-center mt-[80px] mb-[10px]">
        <h1 className="text-3xl font-bold text-left mb-[40px]">
          주문 내역 상세
        </h1>
      </div>
      <div className="mb-[40px]">
        <div className="flex mb-4 ml-[40px] w-[550px]">
          <img
            src={items.image}
            alt={items.title}
            className="w-[150px] h-[150px] rounded-[5px]"
          />
          <div className="text-left px-4 w-[380px]">
            <p className="text-lg font-bold mb-[5px]">{items.title}</p>
            <p>{items.description}</p>
            <p className="text-[#959595]">
              {items.options} | {items.quantity}개
            </p>
            <p className="mt-[40px] text-right text-lg text-nowrap">
              {items.price}원
            </p>
          </div>
        </div>
        <p className="border border-[#D9D9D9] w-[520px] m-auto mt-[40px]"></p>
      </div>
      <div className="text-left ml-[40px]">
        <h2 className="text-xl font-bold">총금액</h2>
      </div>
      <div>
        <div className="flex justify-end mr-[40px] gap-2">
          <p className="text-[#959595]">상품 합</p>
          <p>{items.price}원</p>
        </div>
        <div className="flex justify-end mr-[40px] gap-2">
          <p className="text-[#959595]">배송 비용</p>
          <p>3000원</p>
        </div>
        <div className="text-right mr-[40px] text-xl font-bold mt-[10px]">
          <p>{totalPrice}원</p>
        </div>
      </div>
      <p className="border border-[#D9D9D9] w-[520px] m-auto mt-[40px]"></p>
      <div>
        <div className="text-left ml-[40px] mt-[40px]">
          <h2 className="text-xl font-bold">배송지</h2>
        </div>
        <div className="mt-[30px] ">
          <p className="mr-[470px] font-bold mb-[10px]">이름</p>
          <p className="text-left ml-[50px]">{orders.name}</p>
          <p className="border border-[#D9D9D9] w-[520px] m-auto "></p>
          <p className="mr-[450px] font-bold mt-[10px] mb-[10px]">전화번호</p>
          <p className="text-left ml-[50px]">{orders.phone}</p>
          <p className="border border-[#D9D9D9] w-[520px] m-auto"></p>
          <p className="mr-[460px] font-bold mt-[10px] mb-[10px]">배송지</p>
          <p className="text-left ml-[50px]">{orders.address}</p>
          <p className="border border-[#D9D9D9] w-[520px] m-auto "></p>
        </div>
        <div className="text-left ml-[40px] mt-[40px]">
          <h2 className="text-xl font-bold">결제 방법</h2>
        </div>
        <p className="text-left ml-[40px] mt-[10px]">{orders.paymentMethod}</p>
        <p className="border border-[#D9D9D9] w-[520px] m-auto mb-[50px]"></p>
        <button className="w-[550px] py-3 bg-[#8F5BBD] text-[#fff] border border-[#8F5BBD] rounded-md hover:bg-[#fff] hover:text-[#8F5BBD] duration-200">
          주문 내역으로 가기
        </button>
      </div>
    </div>
  );
}
