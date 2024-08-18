import React, { useEffect, useState } from "react";
import { getCommentItems } from "../../api/firebase";
import { useParams } from "react-router-dom";

interface Comment {
  id: string;
  text: string;
  rank: number;
  createdAt: string;
  uid: string;
  userPhoto: string;
  displayName: string;
}

export default function CommentCard() {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (id) {
      getCommentItems(id).then(setComments);
    }
  }, [id]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  return (
    <div className="text-[14px] mt-[50px]">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="mt-[40px]">
            <div className="flex ml-[40px]">
              <img
                src={comment.userPhoto}
                alt={comment.displayName}
                className="rounded-full w-[70px]"
              />
              <div className="mt-[20px] ml-[15px]">
                <h3 className="text-left text-lg font-bold">
                  {comment.displayName}
                </h3>
                <p className="text-sm">{formatDate(comment.createdAt)}</p>
              </div>
              <p className="mt-[10px] ml-[250px]">Rating: {comment.rank}</p>
            </div>
            <p className="border-b-2 border-0 h-[40px] w-[500px] m-auto text-left mt-[25px] text-lg">
              {comment.text}
            </p>
          </div>
        ))
      ) : (
        <p>리뷰를 작성해 보세요.</p>
      )}
    </div>
  );
}
