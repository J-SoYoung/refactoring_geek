import Layout from "../components/myPage/_Layout";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { loadUsedMessage, sendUsedMessage } from "../api/setting_firebase";
import { MessageListType } from "../types/usedType";
import { makeArr } from "../types/utils";
import { useRecoilValue } from "recoil";
import { geekChickUser } from "../atoms/userAtom";
import MessageSkeleton from "../components/skeleton/MessageSkeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const UsedMessage = () => {
  const location = useLocation();
  const { messageId, userId } = location.state || {};
  const loginUser = useRecoilValue(geekChickUser);
  const [newMessage, setNewMessage] = useState("");

  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["usedMessage"],
    queryFn: () => loadUsedMessage({ userId, messageId }),
  });

  const mutation = useMutation({
    mutationFn: async (newMessageObj: MessageListType) => {
      await sendUsedMessage({
        messages: newMessageObj,
        userId,
        messageId,
        sellerId: data?.seller.sellerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        {
          queryKey: ["usedMessage"],
          refetchType: "active",
          exact: true,
        },
        { throwOnError: true, cancelRefetch: true }
      );
    },
  });

  const onClickSendMessage = () => {
    if (!newMessage) return;
    const newMessageObj: MessageListType = {
      id: "",
      message: newMessage,
      sender: data.seller.sellerId == loginUser.userId ? "seller" : "buyer",
      createdAt: new Date().toISOString(),
    };
    mutation.mutate(newMessageObj);
    setNewMessage("");
  };

  if (isError) {
    console.log(error);
    return <div>데이터를 로드하지 못했습니다.</div>;
  }

  return (
    <Layout title={"쪽지 보내기"} data={loginUser.messages}>
      <div className="w-[596px] p-8 flex min-h-screen flex-col bg-gray-100 relative">
        {/* 판매자정보 */}
        {isPending ? (
          <MessageSkeleton />
        ) : (
          <>
            {/* 판매자정보 */}
            <div className="p-4 border-b bg-white flex mb-8">
              <img
                src={data.itemImage}
                alt="Product"
                className="w-20 h-20 rounded-md object-cover"
              />
              <div className="ml-2 text-left">
                <div className="text-lg font-bold">{data.seller.nickname}</div>
                <div className="text-gray-500">{data.itemName}</div>
                <div className="text-lg font-semibold text-[#8F5BBD]">
                  {data.price.toLocaleString()}원
                </div>
              </div>
              {data?.seller.sellerId !== loginUser.userId && (
                <button className="ml-auto font-bold text-[#8F5BBD]">
                  결제하기
                </button>
              )}
            </div>

            {/* 대화창 */}
            <div className=" max-w-xs p-3 rounded-lg mb-4 bg-gray-200 text-black">
              "{data.itemName}" 판매자
              <br />
              {data.seller.nickname}입니다
            </div>
            {makeArr(data.messageList).map((m) => {
              return (
                <div
                  key={m.id}
                  className={`flex mb-4 ${
                    m.sender === "buyer" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      m.sender === "buyer"
                        ? "bg-[#8F5BBD] text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}

            {/* 대화 입력창 */}
            <div className="w-[532px] flex items-center fixed bottom-24">
              <textarea
                className="border w-full p-2 resize-none outline-0"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
              />
              <button
                className="bg-[#8F5BBD] text-white px-4 py-2 rounded"
                onClick={onClickSendMessage}
              >
                전송
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
export default UsedMessage;
