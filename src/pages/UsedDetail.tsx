import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { geekChickUser } from "../atoms/userAtom";
import { usedItemDetailState } from "../atoms/usedItemAtom";
import { calculateDaysAgo, makeArr } from "../types/utils";
import { addUsedMessagePage, usedDetailItem } from "../api/setting_firebase";

import Chevron_left from "../assets/icons/chevron_left.svg";
import UsedCommentList from "../components/usedDetail/UsedCommentList";
import UsedInputComment from "../components/usedDetail/UsedInputComment";
import UsedDetailSkeleton from "../components/skeleton/UsedDetailSkeleton";

const UsedDetail = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const setUsedDetailItem = useSetRecoilState(usedItemDetailState);
  const { userId, messages } = useRecoilValue(geekChickUser);

  // ⭕함수명 변경 -> 중고 상세페이지 데이터 로드 (주석 지울 수 있게)
  const { data, isPending, isError } = useQuery({
    queryKey: ["usedDetailItem"],
    queryFn: () => usedDetailItem(itemId as string, setUsedDetailItem),
  });
  const currentMessage = makeArr(messages).find((m) => m.itemId === itemId);

  const onClickAddMessagePage = async () => {
    const messageId = uuidv4();
    if (!currentMessage) {
      const messageData = {
        createdAt: new Date().toISOString(),
        itemId,
        itemImage: data.imageArr[0],
        itemName: data.itemName,
        messageList: "",
        messageId: messageId,
        price: data.price,
        seller: data.seller,
        userId,
      };
      console.log("쪽지보내기 방 생성", messageData);
      await addUsedMessagePage(messageData); //⭕타입정리
    }
    navigate(`/message/${itemId}/${userId}`, {
      state: {
        userId,
        messageId: !currentMessage ? messageId : currentMessage.messageId,
      },
    });
  };

  if (isError)
    return (
      <>
        <div> 데이터가 없습니다. </div>
        <Link to="/usedHome">중고 메인페이지로 돌아가기</Link>
      </>
    );

  return (
    <>
      {isPending ? (
        <div className="w-[600px] min-h-screen mb-20 text-left">
          <UsedDetailSkeleton />
        </div>
      ) : (
        <div className="w-[600px] min-h-screen mb-20 text-left">
          <div>
            <button
              className="w-10 h-10 top-2 cursor-pointer fixed"
              onClick={() => navigate(-1)}
            >
              <img src={Chevron_left} alt="이전 페이지로" className="w-full" />
            </button>
            <div className="w-[598px] h-[100%]">
              <div className="mb-6 bg-gray-200 border-red-400">
                <img
                  src={data.imageArr[0]}
                  alt={data.itemName}
                  className="w-[100%] h-96 object-cover"
                />
              </div>
              <div className="flex space-x-4 pl-8">
                {data.imageArr.map((i: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-24 h-24 flex items-center justify-center"
                  >
                    <img src={i} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 relative">
            <div className="flex justify-between items-center border-b">
              <div className="flex pb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full">
                  <img src={data.seller.userAvatar ?? ""} alt="유저" />
                </div>
                <div className="ml-4 ">
                  <div className="text-lg font-semibold">
                    {data.seller.nickname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {data.seller.address}
                  </div>
                </div>
              </div>
              {userId !== data.seller.sellerId && (
                <button
                  className="w-40 inline-block text-center py-3 mb-4 bg-[#8F5BBD] text-white rounded-md "
                  onClick={onClickAddMessagePage}
                >
                  {currentMessage ? "쪽지 이어하기" : "쪽지보내기"}
                </button>
              )}
            </div>

            <div className="my-8 border-b pb-8">
              <div className="text-xl font-bold">{data.itemName}</div>
              <div className="text-sm text-gray-500">
                {calculateDaysAgo(data.createdAt)}
              </div>
              <div className="text-xl font-bold mt-2">
                {data.price.toLocaleString()}원
              </div>

              <div className="flex space-x-2 mt-2">
                {data.options.map((i: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <p className="text-gray-700">{data.description}</p>
            </div>

            {data.comments && <UsedCommentList comments={data.comments} />}
            <UsedInputComment />
          </div>
        </div>
      )}
    </>
  );
};
export default UsedDetail;
