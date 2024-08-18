import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";

import {
  loadUserData,
  usedItemLists,
  usedItemSearch,
} from "../api/setting_firebase";
import { geekChickUser } from "../atoms/userAtom";
import { UsedItemType } from "../types/usedType";

import SearchList from "../components/usedHome/SearchList";
import UsedItemList from "../components/usedHome/UsedItemList";
import UsedSearchBar from "../components/usedHome/UsedSearchBar";
import UsedHomeSkeletonGrid from "../components/skeleton/UsedHomeSkeletonGrid";

const UsedHome = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useRecoilState(geekChickUser);

  // 데이터 업로드 후에 중고메인으로 이동 -> recoil에 user-salelist 업데이트 시켜주기 위함.
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadUserData(user.userId);
      data && setUser(data);
    };
    fetchData();
  }, [user.userId, setUser]);

  const {
    data: usedItems,
    isPending: usedItemLoading,
    isError: usedItemError,
  } = useQuery<UsedItemType[], Error>({
    queryKey: ["usedItems"],
    queryFn: () => usedItemLists(),
    retry: 3, // 쿼리옵션-> 요청 3번 재시도
    retryDelay: 1000, // 쿼리옵션-> 재시도 사이의 지연 시간
  });

  const { data: searchResultData, isPending: searchLoading } = useQuery<
    UsedItemType[],
    Error
  >({
    queryKey: ["searchUsedItems", searchQuery],
    queryFn: () => usedItemSearch(searchQuery),
    enabled: !!searchQuery, // query가 빈 문자열일 때는 쿼리를 실행하지 않음
  });

  const onClickSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(!!query);
  };

  const onClickBackToUsedHome = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  //
  if (usedItemError)
    return (
      <div>
        <p>데이터를 가져오는 동안 문제가 발생했습니다</p>
        <p className="cursor-pointer" onClick={() => window.location.reload()}>
          geekchic 중고 메인 페이지 새로고침
        </p>
      </div>
    );

  return (
    <div className="min-h-screen w-[600px]">
      <header className="p-11 pb-4 text-right">
        <h1 className="text-3xl font-bold text-left mb-5 ">
          <Link to="/usedHome">중고거래</Link>
        </h1>
        <button className="bg-black text-white px-4 py-2 mb-5 rounded-md text-right">
          <Link to="/usedPostUpload">등록하기</Link>
        </button>
        <UsedSearchBar onSearch={onClickSearch} />
      </header>

      <div>
        {usedItemLoading && <UsedHomeSkeletonGrid />}
        {isSearching ? (
          <SearchList
            searchData={searchResultData || []}
            onClickfunc={onClickBackToUsedHome}
            searchLoading={searchLoading}
          />
        ) : (
          usedItems && <UsedItemList usedItems={usedItems} />
        )}
      </div>
    </div>
  );
};

export default UsedHome;
