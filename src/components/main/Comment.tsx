import React, { useState, ChangeEvent, FormEvent } from "react";
import { newComment } from "../../api/setting_firebase";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms/userAtom";

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string[];
}

interface Comment {
  id: string;
  text: string;
  rank: number;
  createdAt: string;
  uid: string;
  userPhoto: string;
  displayName: string;
}

export default function Comment({ product }: { product: Product }) {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [comments, setComments] = useState<Omit<Comment, "id" | "createdAt">>({
    text: "",
    rank: 0,
    uid: "",
    userPhoto: "",
    displayName: "",
  });
  const user = useRecoilValue(userState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComments((comment) => ({ ...comment, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    setIsUploading(true);
    await newComment(product.id, {
      text: comments.text ?? "",
      rank: comments.rank ?? 0,
      uid: user.uid,
      userPhoto: user.photoURL || "",
      displayName: user.displayName || "",
    });
    setSuccess("리뷰 추가 완료!");
    setTimeout(() => {
      setSuccess(null);
    }, 4000);
    setIsUploading(false);
  };

  return (
    <>
      {success && <p className="my-2">✅ {success}</p>}
      <h1 className="text-3xl font-bold text-left ml-[25px] mt-[50px]">
        상품 후기
      </h1>
      <form
        className="flex flex-col px-12 gap-1 mt-[25px]"
        onSubmit={handleSubmit}
      >
        <input
          className="border-b-2 border-0 w-[200px] ml-[300px] mb-[20px] h-[30px]"
          type="number"
          placeholder="평점"
          name="rank"
          value={comments.rank ?? 0}
          required
          onChange={handleChange}
        />
        <button
          className="w-[70px] h-[40px] ml-[430px] -mb-[30px] z-0 bg-[#000] text-[#fff] border border-[#000] rounded-full hover:bg-[#fff] hover:text-[#000] duration-200"
          disabled={isUploading}
        >
          {isUploading ? "업로드중..." : "등록"}
        </button>
        <input
          className=" border-b-2 border-0 h-[30px]"
          type="text"
          placeholder="리뷰를 작성해주세요."
          name="text"
          value={comments.text ?? ""}
          required
          onChange={handleChange}
        />
      </form>
    </>
  );
}
