import React from "react";
import { Link, useLocation } from "react-router-dom";

import { MessagesType } from "../types/usedType";
import Layout from "../components/myPage/_Layout";
import { IsSeller } from "../components/common/IsSeller";


interface Props {
  messages: MessagesType[];
}

const UsedMessageList = () => {
  const location = useLocation();
  const { messages }: Props = location.state || [];

  return (
    <Layout title="쪽지보내기">
      <div className="text-left">
        <div className="p-10 text-left">
          <div className="text-m text-gray-600 mb-4 pb-4 border-b">
            <span className="font-bold">전체 </span>
            {messages.length}
          </div>
          {messages.length === 0 ? (
            <div>
              <p>쪽지가 없습니다</p>
              <Link to={"/usedHome"}>중고 제품을 둘러보세요</Link>
            </div>
          ) : (
            messages.map((m) => {
              return (
                <Link
                  key={m.messageId}
                  to={`/message/${m.itemId}/${m.userId}`}
                  state={{ userId: m.userId, messageId: m.messageId }}
                  className="flex items-center p-2"
                >
                  <div className="w-24 h-24 mr-2">
                    <img
                      src={m.itemImage}
                      alt="icon"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex w-[90%] justify-between items-start">
                    <div className="flex flex-col flex-1">
                      <div className="text-xl font-semibold">{m.itemName}</div>
                      <div className="text-m text-gray-500 flex items-center">
                        <span className="mr-1">{m.seller.nickname}</span>
                        <IsSeller sellerId={m?.seller.sellerId}/>
                      </div>
                    </div>
                    <p className="text-s text-gray-400">
                      {m.createdAt.split("T")[0]}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UsedMessageList;
