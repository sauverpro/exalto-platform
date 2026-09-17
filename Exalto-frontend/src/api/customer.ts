import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

//Types

export interface Address {
  id: number;
  full_name: string;
  phone_number: string;
  district: string;
  sector: string;
  street: string | null;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product: { id: number; name: string; image: string } | null;
}

export interface Order {
  id: number;
  status: string;
  shipping_fee: number;
  total: number;
  currency: string;
  notes: string | null;
  created_at: string;
  address: Address | null;
  order_items: OrderItem[];
}

// ── Orders 

export const fetchOrders = async (token: string): Promise<Order[]> => {
  const res = await axios.get(`${API_URL}/orders`, { headers: authHeaders(token) });
  return res.data?.data ?? [];
};

export const createOrder = async (
  token: string,
  data: { address_id: number; shipping_fee: number; currency: string; notes?: string },
): Promise<Order> => {
  const res = await axios.post(`${API_URL}/order/store`, data, { headers: authHeaders(token) });
  return res.data.data;
};

export const createOrderItem = async (
  token: string,
  data: { order_id: number; product_id: number; quantity: number },
): Promise<void> => {
  await axios.post(`${API_URL}/orderitem/store`, data, { headers: authHeaders(token) });
};

export const createPayment = async (
  token: string,
  data: { order_id: number; amount: number; currency: string; method: string; status: "pending" | "completed" },
): Promise<void> => {
  await axios.post(`${API_URL}/payment/store`, data, { headers: authHeaders(token) });
};

// ── Addresses 

export const fetchAddresses = async (token: string): Promise<Address[]> => {
  const res = await axios.get(`${API_URL}/addresses`, { headers: authHeaders(token) });
  return res.data?.data ?? [];
};

export const createAddress = async (token: string, data: Omit<Address, "id" | "is_default">): Promise<Address> => {
  const res = await axios.post(`${API_URL}/address/store`, data, { headers: authHeaders(token) });
  return res.data.data;
};

export const deleteAddress = async (token: string, id: number): Promise<void> => {
  await axios.delete(`${API_URL}/address/delete/${id}`, { headers: authHeaders(token) });
};

export const setDefaultAddress = async (token: string, id: number): Promise<void> => {
  await axios.put(`${API_URL}/address/default/${id}`, {}, { headers: authHeaders(token) });
};
