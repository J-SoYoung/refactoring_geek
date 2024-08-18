import Layout from "../components/myPage/_Layout";
import { Link } from "react-router-dom";

// ⭕default Image 클라우디너리에 업로드해서 사용하기
import { geekChickUser } from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { defaultImage, makeArr } from "../types/utils";
import { useEffect } from "react";
import { loadUserData } from "../api/firebase";

const MyPage = () => {
  // recoil로 유저 데이터 상시 업데이트 => 전역에서 사용할 수 있게
  const [user, setUser] = useRecoilState(geekChickUser);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadUserData(user.userId);
      data && setUser(data);
    };
    fetchData();
  }, [user.userId, setUser]);

  const sales = makeArr(user.sales);
  const orders = makeArr(user.orders);
  const messages = makeArr(user.messages);
  const carts = makeArr(user.carts);

  if (user == null) {
    return (
      <div>
        <p>로그인이 필요합니다.</p>
        <p>
          <Link to={"/api/login"}>로그인 페이지로 이동합니다</Link>
        </p>
        <p>
          <Link to={"/"}>아니요, 구경만할래요</Link>
        </p>
      </div>
    );
  }

  return (
    <Layout title="마이페이지">
      <div className="m-16 p-4">
        {/* 프로필 관리 */}
        <div className="mb-16 border-b-2">
          <div className="flex items-center mb-8 mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full">
              <img
                src={user.userAvatar ?? defaultImage}
                alt={user.userName ?? ""}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-4 text-left">
              <div className="text-lg font-semibold">{user?.userName}</div>
              <div className="text-sm text-gray-500">
                {user?.address ? user.address : "주소를 작성해주세요"}
              </div>
            </div>
          </div>

          <button className="w-full h-[45px] py-2 mb-16 bg-black text-white rounded-md">
            <Link to="profile">프로필 관리</Link>
          </button>
        </div>

        {/* 내 상품 관리 */}
        <div className="space-y-4">
          <Link
            to="orderlist"
            state={{ user: user }}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer"
          >
            <span className="text-lg">주문내역</span>
            <span className="text-lg font-semibold">{orders.length}</span>
          </Link>
          <Link
            to="salelist"
            state={{ user }}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer"
          >
            <span className="text-lg">판매목록</span>
            <span className="text-lg font-semibold">{sales.length}</span>
          </Link>
          <Link
            to="carts"
            // state={{ user }}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer"
          >
            <span className="text-lg">장바구니</span>
            <span className="text-lg font-semibold">{carts.length}</span>
          </Link>
          <Link
            to="messageList"
            state={{ messages }}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer"
          >
            <span className="text-lg">내 쪽지함</span>
            <span className="text-lg font-semibold">{messages.length}</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
export default MyPage;
