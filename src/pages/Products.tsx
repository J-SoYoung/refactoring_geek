import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";
import SearchHeader from "../components/common/SearchHeader";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/main/ProductCard";
import { getProducts } from "../api/setting_firebase";
// import useProducts from "../api/firebase";
// import { useRecoilValue } from "recoil";
// import { Link } from "react-router-dom";
// import { userState } from "../atoms/userAtom";

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string[];
}

interface Filter {
  text: string;
  name: string;
}

const filters: Filter[] = [
  { text: "전체", name: "all" },
  { text: "아우터", name: "outer" },
  { text: "상의", name: "top" },
  { text: "하의", name: "bottom" },
  { text: "신발", name: "shose" },
  { text: "모자", name: "cap" },
];
export default function Products() {
  const { keyword } = useParams<{ keyword: string }>();
  // const user = useRecoilValue(userState);
  const searchKeyword = keyword || "";
  // const product = useProducts();
  const [filter, setFilter] = useState<Filter>(filters[0]);
  const {
    isLoading,
    error,
    data: products,
  } = useQuery<Product[], Error>({
    queryKey: ["products", searchKeyword],
    queryFn: getProducts,
    // queryFn: () => product.search(searchKeyword),
  });
  const filtered: Product[] = getFilteredItems(products || [], filter.name);

  function getFilteredItems(products: Product[], filter: string): Product[] {
    if (filter === "all") {
      return products;
    }
    return products.filter((product) => product.category === filter);
  }

  {
    isLoading && <p>Loading..</p>;
  }
  {
    error && <p>Something is wrong</p>;
  }

  return (
    <div className="h-full min-h-screen">
      <Header />
      <SearchHeader />
      <div className="flex justify-center ">
        <ul className="flex justify-center gap-[45px] mt-[20px] mb-[40px] text-[23px] border-b-2 border-[#D9D9D9] w-[515px]">
          {filters.map((value, index) => (
            <li key={index} className="relative">
              <button
                className={`${
                  value.text === filter.text ? "font-bold" : ""
                } pb-[14px]`}
                onClick={() => setFilter(value)}
              >
                {value.text}
              </button>
              {value.text === filter.text && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[177%] border-b-2 border-black -mb-[2px]"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        {filtered?.length !== 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[20px] mb-[100px]">
            {filtered?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <div className="h-[100vh]">
            <div className="text-2xl mt-[130px] mb-[40px]">
              검색하신 상품이 없어요.
            </div>
            <button className="w-[220px] py-2 bg-[#fff] text-[#8F5BBD] border border-[#8F5BBD] rounded-md hover:bg-[#8F5BBD] hover:text-[#fff] duration-200">
              상품으로 바로가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
