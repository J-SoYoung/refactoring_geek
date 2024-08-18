import { useState } from "react";
import { BsSearch } from "react-icons/bs";

interface UsedSearchHeaderProps {
  onSearch: (query: string) => void;
}

const UsedSearchBar = ({ onSearch }: UsedSearchHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="flex mb-4 text-xl">
      <div className="flex w-[100%]">
        <input
          className="w-[100%] p-2 outline-none bg-[#EEE] placeholder-gray-500 rounded-l-[8px] border-0 pl-4 "
          type="text"
          placeholder="상품검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-[#EEE] rounded-r-[8px] mt-1 px-4 h-[44px] box-border"
          onClick={handleSearch}
          type="button"
        >
          <BsSearch />
        </button>
      </div>
    </div>
  );
};

export default UsedSearchBar;
