import TrashIcon from "../../assets/icons/trash.svg";
import Plus from "../../assets/icons/square_plus.svg";
import Minus from "../../assets/icons/square_minus.svg";
import { PayProduct } from "../../api/firebase";

export interface UsedItemListType {
  item: PayProduct;
  isCart: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

const MyUsedItemList = ({
  item,
  isCart,
  onQuantityChange,
  onRemove,
}: UsedItemListType) => {
  return (
    <div className={isCart ? "border-b mb-8" : ""}>
      <div key={item.id} className="flex mb-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
        <div className="w-full flex justify-between ">
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="font-semibold">{item.description}</p>
            <p className="text-sm text-gray-500">
              {item.options[0]} | {item.quantity}개
            </p>
            <p className="font-bold text-lg">{item.price}원 </p>
          </div>
          {isCart && (
            <div className="flex">
              <div className="flex items-center">
                <button
                  onClick={() =>
                    onQuantityChange && onQuantityChange(item.id, 1)
                  }
                >
                  <img
                    src={Minus}
                    alt="빼기"
                    className="w-5 h-5 mx-auto mx-2.5"
                  />
                </button>
                <span className="">1</span>
                <button
                  onClick={() =>
                    onQuantityChange && onQuantityChange(item.id, 1)
                  }
                >
                  <img
                    src={Plus}
                    alt="추가하기"
                    className="w-5 h-5 mx-auto mx-2.5"
                  />
                </button>
              </div>
              <button onClick={() => onRemove && onRemove(item.id)}>
                <img src={TrashIcon} alt="삭제" className="w-5 h-5 mx-auto" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyUsedItemList;
