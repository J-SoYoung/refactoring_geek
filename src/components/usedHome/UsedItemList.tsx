import UsedItemCard from "./UsedItemCard";
import { UsedItemType } from "../../types/usedType";

interface UsedItemListProps {
  usedItems: UsedItemType[];
}

const UsedItemList = ({ usedItems }: UsedItemListProps) => {
  return (
    <>
      <p className="text-left px-11">
        전체<span>{usedItems && usedItems.length}</span>
      </p>
      <div className="p-8 pt-4 grid grid-cols-2 gap-4 mb-24">
        {usedItems.map((item) => (
          <UsedItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default UsedItemList;
