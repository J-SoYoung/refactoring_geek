import React, { useState, ChangeEvent, FormEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import { addOrderList } from "../api/firebase";

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string[];
  quantity: number;
}

interface OrderDetails {
  ordersId?: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
}

export default function Payment() {
  const { id } = useParams<string>();
  const location = useLocation();
  const state = location.state as { payProduct?: Product };
  const payProduct = state?.payProduct;

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  if (!payProduct) {
    return <div>데이터가 없습니다.</div>;
  }
  const { description, image, price, options, title, quantity } = payProduct;
  const numPrice = Number(price);
  const totalPrice = `${numPrice + 3000}`;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = id ?? "";

    if (!userId) {
      alert("유효하지 않은 사용자 ID입니다.");
      return;
    }

    try {
      await addOrderList(userId, payProduct, orderDetails);
      alert("주문이 성공적으로 완료되었습니다.");
    } catch (error) {
      alert("주문 실패");
    }
  };

  return (
    <div className="container w-[600px]">
      <div className="flex justify-center mt-[80px] mb-[10px]">
        <h1 className="text-3xl font-bold text-left mb-[20px]">주문 상세</h1>
      </div>
      <div className="mb-[40px]">
        <div className="flex mb-4 ml-[40px] w-[550px]">
          <img
            src={image}
            alt={title}
            className="w-[150px] h-[150px] rounded-[5px]"
          />
          <div className="text-left px-4 w-[380px]">
            <p className="text-lg font-bold mb-[5px]">{title}</p>
            <p>{description}</p>
            <p className="text-[#959595]">
              {options} | {quantity}개
            </p>
            <p className="mt-[40px] text-right text-lg text-nowrap">
              {price}원
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
          <p>{price}원</p>
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mt-[30px]">
            <label className="mr-[470px] font-bold">이름</label>
            <input
              type="text"
              name="name"
              className="w-[520px] border-b-2 border-0 h-[30px] pl-[10px]"
              placeholder="이름을 입려하세요."
              required
              onChange={handleChange}
            />
            <label className="mr-[450px] font-bold mt-[10px]">전화번호</label>
            <input
              type="number"
              name="phone"
              className="w-[520px] border-b-2 border-0 h-[30px] pl-[10px]"
              placeholder="전화번호를 입려하세요."
              required
              onChange={handleChange}
            />
            <label className="mr-[460px] font-bold mt-[10px]">배송지</label>
            <input
              type="text"
              name="address"
              className="w-[520px] border-b-2 border-0 h-[30px] pl-[10px]"
              placeholder="배송지를 입려하세요."
              required
              onChange={handleChange}
            />
          </div>
          <div className="text-left ml-[40px] mt-[40px]">
            <h2 className="text-xl font-bold">결제 방법</h2>
          </div>
          <div className="w-full flex flex-col mb-[30px]">
            <select
              className="p-3 m-7 border-2 border-brand rounded-md outline-none bg-[#EEE]"
              id="select"
              name="paymentMethod"
              onChange={handleChange}
            >
              <option value={""}>결제 방법을 선택하세요.</option>
              <option value={"creditcard"}>카드결제</option>
              <option value={"cash"}>계좌이체</option>
              <option value={"pay"}>페이결제</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-[550px] py-3 bg-[#8F5BBD] text-[#fff] border border-[#8F5BBD] rounded-md hover:bg-[#fff] hover:text-[#8F5BBD] duration-200"
          >
            결제하기
          </button>
        </form>
      </div>
    </div>
  );
}
