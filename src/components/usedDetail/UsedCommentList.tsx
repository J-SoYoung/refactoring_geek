import UsedComment from "./UsedComment";
import { UsedCommentType } from "../../types/usedType";

interface CommentListProps {
  comments: { [key: string]: UsedCommentType };
}

const UsedCommentList = ({ comments }: CommentListProps) => {
  const commentsArr = Object.entries(comments).map(([, value]) => ({
    ...value,
  }));

  return (
    <div className="mb-10">
      <div className="text-lg font-bold mb-4">댓글 {commentsArr.length}</div>
      {commentsArr.map((comment: UsedCommentType) => (
        <UsedComment key={comment.commentId} commentObj={comment} />
      ))}
    </div>
  );
};

export default UsedCommentList;
