import { atom, RecoilState } from "recoil";
import { UsedItemType } from "../types/usedType";

// ⭕ atom localStorage저장하는 코드 함수로 빼기.
// const aa = (localName) =>{
//   ({ setSelf, onSet })=>{
//     const savedItems = localStorage.getItem(localName);
//     if (savedItems != null) {
//       setSelf(JSON.parse(savedItems));
//     }
//     onSet((newItem) => {
//       if (newItem != null) {
//         localStorage.setItem(localName, JSON.stringify(newItem));
//       } else {
//         localStorage.removeItem(localName);
//       }
//     });
//   }
// }

export const usedItemDetailState:RecoilState<UsedItemType> = atom({
  key: "usedItemDetailState",
  default: [],
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      const savedItems = localStorage.getItem("usedItemDetailState");
      if (savedItems != null) {
        setSelf(JSON.parse(savedItems));
      }
      onSet((newItem) => {
        if (newItem != null) {
          localStorage.setItem("usedItemDetailState", JSON.stringify(newItem));
        } else {
          localStorage.removeItem("usedItemDetailState");
        }
      });
    },
  ],
});
