import UsedItemCard from "./UsedItemCard";
import { UsedItemType } from "../../types/usedType";

interface UsedItemListProps {
  searchData: UsedItemType[];
  onClickfunc: () => void;
  searchLoading: boolean;
}

const SearchList = ({
  searchData,
  onClickfunc,
  searchLoading,
}: UsedItemListProps) => {
  if (searchLoading) return <div>검색결과를 찾고 있습니다.</div>;

  return (
    <div className="min-h-screen overflow-auto">
      <p className="text-left px-11">
        전체<span>{searchData.length}</span>
      </p>
      {searchData.length !== 0 ? (
        searchData.map((item) => (
          <div key={item.id} className="p-8 pt-4 grid grid-cols-2 gap-4">
            <UsedItemCard item={item} />
          </div>
        ))
      ) : (
        <div>검색결과가 없습니다</div>
      )}
      <button onClick={onClickfunc}>중고 메인으로 돌아가기</button>
    </div>
  );
};

export default SearchList;
