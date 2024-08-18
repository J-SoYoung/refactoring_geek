import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../../assets/icons/nav_home.svg";
import HomeActIcons from "../../assets/icons/nav_homeActive.svg";
import ItemsIcon from "../../assets/icons/nav_items.svg";
import ItemsActIcons from "../../assets/icons/nav_itemsActive.svg";
import WishIcon from "../../assets/icons/nav_wish.svg";
import WishActIcons from "../../assets/icons/nav_wishActive.svg";
import UsedIcon from "../../assets/icons/nav_used.svg";
import UsedActIcon from "../../assets/icons/nav_usedActive.svg";
import MyIcon from "../../assets/icons/nav_my.svg";
import MyActIcon from "../../assets/icons/nav_myActive.svg";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms/userAtom";

const BottomNav = () => {
  const location = useLocation();
  const firebaseUser = useRecoilValue(userState);

  return (
    <nav className="fixed bottom-0 mx-auto w-[598px] max-w-[597px] border-t-2 bg-[#fff]">
      <ul className="flex justify-around p-4">
        <Link to="/" className="text-center cursor-pointer">
          <img
            src={location.pathname === "/" ? HomeActIcons : HomeIcon}
            alt="Home"
            className="w-6 h-6 mx-auto"
          />
          <span className="text-xs">홈</span>
        </Link>
        <Link to="/products" className="text-center cursor-pointer">
          <img
            src={location.pathname === "/products" ? ItemsActIcons : ItemsIcon}
            alt="Products"
            className="w-6 h-6 mx-auto"
          />
          <span className="text-xs">상품</span>
        </Link>
        <Link to="/wishlist" className="text-center cursor-pointer">
          <img
            src={location.pathname === "/wishlist" ? WishActIcons : WishIcon}
            alt="Wishlist"
            className="w-6 h-6 mx-auto"
          />
          <span className="text-xs">관심물품</span>
        </Link>
        <Link to="/usedHome" className="text-center cursor-pointer">
          <img
            src={location.pathname === "/usedHome" ? UsedActIcon : UsedIcon}
            alt="Home"
            className="w-6 h-6 mx-auto"
          />
          <span className="text-xs">중고거래</span>
        </Link>
        <Link
          to={`/my/${firebaseUser && firebaseUser.uid}`}
          className="text-center cursor-pointer"
        >
          <img
            src={
              location.pathname === `/my/${firebaseUser && firebaseUser.uid}`
                ? MyActIcon
                : MyIcon
            }
            alt="Home"
            className="w-6 h-6 mx-auto"
          />
          <span className="text-xs">마이</span>
        </Link>
      </ul>
    </nav>
  );
};

export default BottomNav;
