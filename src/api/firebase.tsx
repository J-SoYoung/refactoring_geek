import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  push,
  set,
  query,
  orderByKey,
  onValue,
  orderByChild,
  remove,
  update,
} from "firebase/database";
import {
  UsedItemType,
  UserDataType,
  UsedCommentType,
  UsedSaleItem,
  MessagesType,
  MessageListType,
} from "../types/usedType";
import { SetterOrUpdater } from "recoil";
interface AdminUser extends User {
  isAdmin: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string[];
}

export interface addProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string;
}

export interface PayProduct extends Product {
  quantity: number;
}

export interface testOrderProduct {
  title: string;
  description: string;
  price: string;
  image: string;
  options: string;
  quantity: number;
}

export interface testProduct {
  title: string;
  description: string;
  price: string;
  image: string;
  options: string[];
  quantity: number;
}

export interface getOrderDetails {
  ordersId?: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
  items: testProduct[];
}

export interface OrderDetails {
  ordersId?: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt?: string;
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

export interface CartProducts {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  options: string;
  quantity: number;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export async function login(): Promise<User | void> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
  }
}

export async function logout(): Promise<void | null> {
  try {
    await signOut(auth);
    return null;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export function onUserStateChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await fetchAdminUser(user) : null;
    callback(updatedUser);
  });
}

async function fetchAdminUser(user: User): Promise<AdminUser> {
  const snapshot = await get(ref(database, "admins"));
  if (snapshot.exists()) {
    const admins = snapshot.val();
    const isAdmin = admins.includes(user.uid);
    return { ...user, isAdmin };
  }
  return { ...user, isAdmin: false };
}

const searchProducts = async (keyword: string): Promise<Product[]> => {
  const response = get(ref(database, "products"));
  const products: Product[] = [];

  (await response).forEach((childSnapshot) => {
    const item = childSnapshot.val();
    const product: Product = {
      id: childSnapshot.key as string,
      title: item.title,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      options: item.options,
    };
    products.push(product);
  });

  const filteredItems = products.filter((item) =>
    item.description.toLowerCase().includes(keyword.toLowerCase())
  );

  return filteredItems;
};

export default function useProducts() {
  const search = async (keyword: string): Promise<Product[]> => {
    return keyword ? searchProducts(keyword) : getProducts();
  };
  return { search };
}

export async function getProducts(): Promise<Product[]> {
  return get(ref(database, "products")).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function addNewProduct(
  product: addProduct,
  image: string
): Promise<void> {
  const id = uuidv4();
  const definedId = id.replace(/[.#$[\]]/g, "_");

  set(ref(database, `products/${definedId}`), {
    ...product,
    id,
    price: product.price,
    image,
    // options: product.options,
    options: product.options.split(","),
  });
}

export async function addWishlistItem(
  userId: string,
  product: Product
): Promise<void> {
  const wishlistRef = ref(database, `wishlist/${userId}/${product.id}`);
  return set(wishlistRef, product);
}

export async function setWishlistItems(
  userId: string,
  wishlist: Product[]
): Promise<void> {
  await set(ref(database, `wishlist/${userId}`), wishlist);
}

// export async function removeWishlistItem(
//   userId: string,
//   product: Product
// ): Promise<void> {
//   return remove(ref(database, `wishlist/${userId}/${product.id}}`));
// }

export async function getWishlistItems(userId: string): Promise<Product[]> {
  const wishlistRef = ref(database, `wishlist/${userId}`);
  return get(wishlistRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(Object.values(snapshot.val()));
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function newComment(
  productId: string,
  comments: Omit<Comment, "id" | "createdAt">
): Promise<void> {
  const commentId = uuidv4();
  const newComment: Comment = {
    id: commentId,
    text: comments.text,
    rank: comments.rank,
    createdAt: new Date().toISOString(),
    uid: comments.uid,
    userPhoto: comments.userPhoto,
    displayName: comments.displayName,
  };

  const commentRef = ref(
    getDatabase(),
    `products/${productId}/comments/${commentId}`
  );
  await set(commentRef, newComment);
}

export async function getCommentItems(productId: string): Promise<Comment[]> {
  const commentsRef = ref(getDatabase(), `products/${productId}/comments`);
  return get(commentsRef).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function addOrderList(
  userId: string,
  product: PayProduct,
  orderDetails: OrderDetails
): Promise<void> {
  const ordersId = uuidv4();
  const orderRef = ref(database, `userData/${userId}/orders/${ordersId}`);
  // const newOrderRef = push(orderRef);

  const orderData = {
    items: {
      description: product.description,
      image: product.image,
      price: product.price,
      options: product.options,
      title: product.title,
      quantity: product.quantity,
    },
    ordersId,
    name: orderDetails.name,
    phone: orderDetails.phone,
    address: orderDetails.address,
    paymentMethod: orderDetails.paymentMethod,
    createdAt: new Date().toISOString(),
  };

  return set(orderRef, orderData);
}

export async function getOrderItems(
  userId: string
): Promise<getOrderDetails[]> {
  const orderItemsRef = ref(getDatabase(), `userData/${userId}/orders`);
  return get(orderItemsRef).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function getCart(userId: string): Promise<CartProducts[]> {
  return get(ref(database, `userData/${userId}/carts`)).then((snapshot) => {
    const items = snapshot.val() || {};
    return Object.values(items);
  });
}

export async function addOrUpdateToCart(userId: string, product: CartProducts) {
  return set(ref(database, `userData/${userId}/carts/${product.id}`), product);
}

export async function removeFromCart(userId: string, productId: string) {
  return remove(ref(database, `userData/${userId}/carts/${productId}`));
}

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
