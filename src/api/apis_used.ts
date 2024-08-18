import {
  get,
  onValue,
  orderByChild,
  orderByKey,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { database } from "./setting_firebase";
import {
  MessageListType,
  MessagesType,
  UsedCommentType,
  UsedItemType,
  UsedSaleItem,
  UserDataType,
} from "../types/usedType";
import { SetterOrUpdater } from "recoil";

// 중고 제품 업로드
// ⭕ 주석/함수이름 통일 => 추가Add, 삭제Remove, 수정Edit, 불러오기Load
// ⭕ 아래 변수 구조분해할당 한 부분 뭐가 다른거지?
export async function usedItemUpload(
  itemData: UsedItemType,
  setUser: SetterOrUpdater<UserDataType>,
  user: UserDataType
) {
  // UsedItems
  const usedItemRef = ref(database, "usedItems");
  const newItemRef = push(usedItemRef);
  itemData.id = newItemRef.key ?? `${new Date()}_${itemData.itemName}`;

  // UserData/sales
  const userSaleItemsRef = ref(
    database,
    `userData/${itemData.seller.sellerId}/sales`
  );
  const newSaleItemRef = push(userSaleItemsRef);
  const {
    createdAt,
    id,
    imageArr,
    isSales,
    itemName,
    options,
    price,
    quantity,
    size,
  } = itemData;
  const saleItem: UsedSaleItem = {
    createdAt,
    id,
    imageArr,
    isSales,
    itemName,
    options,
    price,
    quantity,
    size,
  };

  // UsedItems, UserData/sales 둘다 업로드
  const updates = {
    [`usedItems/${id}`]: itemData,
    [`userData/${itemData.seller.sellerId}/sales/${newSaleItemRef.key}`]:
      saleItem,
  };
  await update(ref(database), updates);
  setUser({ ...user, sales: { ...saleItem } });
}

// 중고 메인 데이터 받아오기
export function usedItemLists(): Promise<UsedItemType[]> {
  return new Promise((resolve, reject) => {
    const usedDataRef = ref(database, "usedItems");
    const sortUsedItem = query(usedDataRef, orderByKey());

    // key가 item1Id일 때: { ...data["item1Id"] }는 { "property1": "value1", "property2": "value2" }를 반환
    // firebase 객체를 배열로 받아오는 것
    onValue(
      sortUsedItem,
      (snapshop) => {
        const data = snapshop.val();
        if (data) {
          const dataArr = Object.keys(data).map((key) => ({
            ...data[key],
          }));
          dataArr.reverse();
          resolve(dataArr);
        } else {
          resolve([]);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// 중고 상세페이지 데이터 받아오기
export async function usedDetailItem(
  itemId: string,
  setUsedDetailItem: SetterOrUpdater<UsedItemType>
) {
  try {
    const itemRef = ref(database, `usedItems/${itemId}`);
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      setUsedDetailItem(snapshot.val());
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Item not found");
  }
}

// ⭕ 댓글 최신순으로 db에 저장 or db에서 가져오기
// 댓글 추가 ( = 아이템 데이터 수정 )
interface DataType {
  comment: string;
  userId: string;
  nickname: string | null;
  userAvatar: string | null;
}
export async function addUsedComment(
  itemId: string,
  comments: DataType,
  setItem: SetterOrUpdater<never[]>,
  item: UsedItemType
) {
  try {
    const itemRef = ref(database, `usedItems/${itemId}/comments`);
    const commentKeyRef = push(itemRef);

    const commentData: UsedCommentType = {
      commentId: commentKeyRef.key ?? `${new Date()}_${comments.userId}`,
      createdAt: new Date().toISOString(),
      comment: comments.comment,
      userId: comments.userId,
      nickname: comments.nickname ?? "",
      userAvatar: comments.userAvatar ?? "",
    };
    await set(commentKeyRef, commentData);

    const updatedComments = {
      [commentData.commentId]: commentData,
      ...item.comments,
    };

    setItem({ ...item, comments: updatedComments });
  } catch (err) {
    console.error("댓글 작성 에러", err);
  }
}

// 댓글 삭제
export async function removeUsedComment(
  itemId: string,
  commentId: string,
  userId: string
): Promise<void> {
  console.log(itemId, commentId, userId);
  const itemRef = ref(database, `usedItems/${itemId}/comments/${commentId}`);
  await remove(itemRef);
}

// 댓글 수정
export async function editUsedComment(
  itemId: string | undefined,
  commentId: string,
  data: UsedCommentType
) {
  const itemRef = ref(database, `usedItems/${itemId}/comments/${commentId}`);
  try {
    await update(itemRef, data);
  } catch (err) {
    console.error("댓글 수정 에러", err);
  }
}

// 중고 데이터 쿼리 검색
export async function usedItemSearch(
  queryString: string
): Promise<UsedItemType[]> {
  return new Promise((resolve, reject) => {
    const usedItemRef = ref(database, "usedItems");
    const queryUsedItem = query(usedItemRef, orderByChild("itemName"));

    onValue(
      queryUsedItem,
      (snapshop) => {
        const data = snapshop.val();
        if (data) {
          const dataArr = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          dataArr.reverse();
          const filterData = dataArr.filter((item) =>
            item.itemName.toLowerCase().includes(queryString.toLowerCase())
          );
          resolve(filterData);
        } else {
          resolve([]);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// 유저 데이터 생성
export async function uploadUserData(
  data: UserDataType
): Promise<UserDataType> {
  const userRef = ref(database, `userData/${data.userId}`);
  await set(userRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return data;
}

// 유저 데이터 불러오기
export async function loadUserData(
  userId: string
): Promise<UserDataType | null> {
  const userRef = ref(database, `userData/${userId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val() as UserDataType;
  } else {
    return null;
  }
}

// 유저 프로필 수정
export async function editUserData(
  updatedUser: UserDataType,
  setUser: SetterOrUpdater<UserDataType>
) {
  try {
    const userEditRef = ref(database, `userData/${updatedUser.userId}`);
    await set(userEditRef, updatedUser);
    setUser(updatedUser);
  } catch (err) {
    console.error("Error 유저 프로필 수정");
  }
}

// 쪽지 페이지 생성
export async function addUsedMessagePage(messageData: MessagesType) {
  const { seller, userId, messageId } = messageData;
  try {
    const updates = {
      [`/userData/${seller.sellerId}/messages/${messageId}`]: messageData,
      [`/userData/${userId}/messages/${messageId}`]: messageData,
    };
    await update(ref(database), updates);
  } catch (err) {
    console.error("메세지 생성 에러", err);
  }
}

// 쪽지 페이지 불러오기
interface loadUsedMessagePropsType {
  userId: string;
  messageId: string;
}
export async function loadUsedMessage({
  userId,
  messageId,
}: loadUsedMessagePropsType) {
  try {
    const messageRef = ref(
      database,
      `userData/${userId}/messages/${messageId}`
    );
    const snapshot = await get(messageRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (err) {
    console.error("쪽지페이지 불러오기 에러", err);
  }
}

// 쪽지 보내기 ( messageList에 쪽지 저장 )
interface sendUsedMessagePropsType {
  messages: MessageListType;
  userId: string;
  messageId: string;
  sellerId: string;
}
export async function sendUsedMessage({
  messages,
  userId,
  messageId,
  sellerId,
}: sendUsedMessagePropsType) {
  try {
    const generateRandomKey = () => {
      const tempRef = push(ref(database));
      return tempRef.key ?? new Date().toISOString();
    };
    messages.id = generateRandomKey();

    const updates = {
      [`/userData/${sellerId}/messages/${messageId}/messageList/${messages.id}`]:
        messages,
      [`/userData/${userId}/messages/${messageId}/messageList/${messages.id}`]:
        messages,
    };
    await update(ref(database), updates);
  } catch (err) {
    console.error(err);
  }
}
