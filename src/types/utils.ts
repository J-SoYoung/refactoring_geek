// 날짜 변환 함수 ( ~일전 )
export const calculateDaysAgo = (createdAt: string): string => {
  const uploadDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - uploadDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return `${daysDifference}일전`;
};

// ⭕타입 지정 - 제네릭!!
// 객체를 배열로 변환하는 함수
export const makeArr = (data) => {
  return Object.entries(data || []).map(([, value]) => ({
    ...value,
  }));
};

// defaultImage
export const defaultImage = "https://via.placeholder.com/150";
