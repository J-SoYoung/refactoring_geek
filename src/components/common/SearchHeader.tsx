import React, { FormEvent, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

export default function SearchHeader() {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    navigate(`/${text}`);
  };

  useEffect((): void => setText(keyword || ""), [keyword]);

  return (
    <header className="w-[600px] flex mb-4 text-xl ml-[25px]">
      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          className="w-9/12 p-2 outline-none bg-[#EEE] placeholder-gray-500 rounded-l-[8px] border-0 pl-4 "
          type="text"
          placeholder="상품검색"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-[#EEE] rounded-r-[8px] mt-1 px-4 h-[44px] box-border">
          <BsSearch />
        </button>
      </form>
    </header>
  );
}
