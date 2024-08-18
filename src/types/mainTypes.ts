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
