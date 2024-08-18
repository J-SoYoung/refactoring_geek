import { get, getDatabase, ref, remove, set } from "firebase/database";
import { database } from "./setting_firebase";
import { v4 as uuidv4 } from "uuid";
import {
  CartProducts,
  getOrderDetails,
  OrderDetails,
  PayProduct,
  Product,
} from "../types/mainTypes";

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
