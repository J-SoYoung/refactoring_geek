import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/common/Header";
import SearchHeader from "../components/common/SearchHeader";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/main/ProductCard";
import useProducts, {
  loadUserData,
  uploadUserData,
} from "../api/setting_firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, geekChickUser } from "../atoms/userAtom";
import { UserDataType } from "../types/usedType";

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string[];
}

export default function Home() {
  const { keyword } = useParams<{ keyword: string }>();
  const user = useRecoilValue(userState);
  const setGeekUser = useSetRecoilState(geekChickUser);

  const searchKeyword = keyword || "";
  const { search } = useProducts();

  const {
    isLoading,
    error,
    data: products,
  } = useQuery<Product[], Error>({
    queryKey: ["products", searchKeyword],
    queryFn: () => search(searchKeyword),
  });
  {
    isLoading && <p>Loading..</p>;
  }
  {
    error && <p>Something is wrong</p>;
  }

  // ⭕ 타입해결
  useEffect(() => {
    const fetchData = async () => {
      // 로그인을 했는지 확인
      if (user) {
        // firebase db에 유저 찾기
        const data = await loadUserData(user.uid);
        setGeekUser(data);

        // firebase db에 유저 없는 경우 유저 데이터 생성
        if (!data && user) {
          const newUser: UserDataType = {
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            nickname: user.displayName,
            userAvatar: user.photoURL,
            address: "",
            phone: user.phoneNumber,
          };
          await uploadUserData(newUser);
          setGeekUser(newUser);
        }
      }
    };
    fetchData();
  }, [user, setGeekUser]);

  return (
    <div className="min-h-screen w-[600px]">
      <header className="p-11 pb-4 text-right">
        <Header />
        {/* <UsedSearchBar onSearch={onClickSearch} /> */}
      </header>

      {/* <div>
        {keyword ? (
          <div>
            {products?.length !== 0 ? (
              <div>
                <div className="w-full h-[300px] mt-[30px]">
                  <img
                    className="object-cover object-center w-[100%] h-[100%]"
                    src="/public/img/mainImg.jpg"
                    alt="mainImage"
                  />
                </div>
                <p className="text-lg font-bold text-left ml-[30px] mt-[30px] mb-[15px] flex">
                  {keyword}
                  <p className="ml-[5px] text-[#BEBEBE]">{products?.length}</p>
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            <div className="w-full h-[300px] mt-[30px]">
              <img
                className="object-cover object-center w-[100%] h-[100%]"
                src="/public/img/mainImg.jpg"
                alt="mainImage"
              />
            </div>
            <div className="flex space-x-[320px] ml-[30px] items-center mt-[30px] mb-[20px]">
              <div className="text-lg font-bold text-left">최근 등록 상품</div>
              {user && user.isAdmin && (
                <Link to="products/new">
                  <button className="py-2 px-7 bg-[#8F5BBD] text-[#fff] border border-[#8F5BBD] rounded-md hover:bg-[#fff] hover:text-[#8F5BBD] duration-200">
                    상품 등록
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div> */}

      {/* <div className="flex justify-center">
        {products?.length !== 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[20px] mb-[100px]">
            {products?.map((product) => (
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
      </div> */}
    </div>
  );
}
