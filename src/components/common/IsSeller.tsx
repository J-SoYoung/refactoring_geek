import { useRecoilValue } from "recoil";
import { geekChickUser } from "../../atoms/userAtom";
import icon_King from "../../assets/icons/king.svg";

// 로그인 유저가 판매자인 경우 ICon생성하기
export const IsSeller = ({ sellerId }: { sellerId: string | null }) => {
  const loginUser = useRecoilValue(geekChickUser);
  if (sellerId && sellerId == loginUser.userId)
    return <img src={icon_King} className="w-4" alt="유저가 판매자" />;
};
