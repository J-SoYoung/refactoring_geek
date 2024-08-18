import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { usedItemDetailState } from "../../atoms/usedItemAtom";
import { geekChickUser } from "../../atoms/userAtom";
import { addUsedComment } from "../../api/setting_firebase";
import { useParams } from "react-router-dom";
import { UsedItemType } from "../../types/usedType";

const UsedInputComment = () => {
  const user = useRecoilValue(geekChickUser);
  const { itemId } = useParams();
  const [newUsedComment, setNewUsedComment] = useState("");
  const [item, setItem] = useRecoilState<UsedItemType>(usedItemDetailState);

  const handleAddUsedItemComment = async () => {
    if (user && item && itemId) {
      const comments = {
        comment: newUsedComment,
        userId: user.userId,
        nickname: user.nickname,
        userAvatar: user.userAvatar,
      };
      await addUsedComment(itemId, comments, setItem, item);
      setNewUsedComment("");
    }
  };

  return (
    <div className="mb-10 w-[535px] h-[120px] fixed bottom-0 bg-white">
      <div className="flex mt-4 h-[50px]">
        <input
          type="text"
          className="h-[100%] flex-1 px-4 border rounded-l-md m-0"
          placeholder="댓글을 입력하세요"
          value={newUsedComment}
          onChange={(e) => setNewUsedComment(e.target.value)}
        />

        <button
          onClick={handleAddUsedItemComment}
          className="px-4 py-2 bg-[#8F5BBD] text-white rounded-r-md"
        >
          댓글 추가
        </button>
      </div>
    </div>
  );
};

export default UsedInputComment;
