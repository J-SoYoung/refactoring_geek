import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addOrUpdateToCart,
  getCart,
  removeFromCart,
} from "../api/setting_firebase";
import { useAuthContext } from "../context/AuthContext";

export default function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["carts", uid || ""],
    queryFn: getCart(uid),
    enabled: !!uid,
  });

  const addOrUpdateItem = useMutation({
    mutationFn: ({ product }) => addOrUpdateToCart(uid, product),

    onSuccess: () => {
      queryClient.invalidateQueries(["cart", uid]);
    },
  });
  const removeItem = useMutation({
    mutationFn: ({ id }) => removeFromCart(uid, id),

    onSuccess: () => {
      queryClient.invalidateQueries(["cart", uid]);
    },
  });
  return { cartQuery, addOrUpdateItem, removeItem };
}
