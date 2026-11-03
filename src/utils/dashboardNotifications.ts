import type { DashboardNotification } from "../components/admin/NotificationBell";

/** Stock at or below this (but above 0) counts as running low. */
export const LOW_STOCK_THRESHOLD = 5;
const MAX_NOTIFICATIONS = 30;

interface OrderLike {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
}
interface ProductLike {
  id: number;
  name: string;
  stock: number;
}
interface PaymentLike {
  id: number;
  orderId: number | null;
  customer: string;
  amount: number;
  status: string;
  date: string;
}
interface CustomerLike {
  id: string;
  name: string;
  status: string;
}

/**
 * Turn what a dashboard already has loaded into notifications. Ids include the
 * state that triggered them, so e.g. an order moving from "Pending Payment" to
 * "Processing" appears as a new, unread notification.
 */
export function buildDashboardNotifications({
  orders = [],
  products = [],
  payments,
  customers = [],
}: {
  orders?: OrderLike[];
  products?: ProductLike[];
  /** When given, unpaid orders are reported as payments instead of orders. */
  payments?: PaymentLike[];
  customers?: CustomerLike[];
}): DashboardNotification[] {
  const list: DashboardNotification[] = [];
  const money = (value: number) => `Fr ${Math.round(value).toLocaleString()}`;

  orders.forEach((order) => {
    if (order.status === "Pending Payment" && !payments) {
      list.push({
        id: `order-${order.id}-pending`,
        kind: "order",
        tone: "warning",
        title: `Order #${order.id} is awaiting payment`,
        detail: `${order.customer} · ${money(order.total)}`,
        time: order.date,
        tab: "orders",
      });
    } else if (order.status === "Processing") {
      list.push({
        id: `order-${order.id}-processing`,
        kind: "order",
        tone: "info",
        title: `Order #${order.id} is ready to fulfil`,
        detail: `${order.customer} · ${money(order.total)}`,
        time: order.date,
        tab: "orders",
      });
    }
  });

  payments?.forEach((payment) => {
    if (payment.status !== "Pending") return;
    list.push({
      id: `payment-${payment.id}-pending`,
      kind: "payment",
      tone: "warning",
      title: `Payment of ${money(payment.amount)} needs confirming`,
      detail: `${payment.customer}${payment.orderId ? ` · Order #${payment.orderId}` : ""}`,
      time: payment.date,
      tab: "payments",
    });
  });

  products.forEach((product) => {
    if (product.stock <= 0) {
      list.push({
        id: `stock-${product.id}-out`,
        kind: "stock",
        tone: "danger",
        title: `${product.name} is out of stock`,
        detail: "Customers can't order it until stock is added.",
        tab: "products",
      });
    } else if (product.stock <= LOW_STOCK_THRESHOLD) {
      list.push({
        id: `stock-${product.id}-low-${product.stock}`,
        kind: "stock",
        tone: "warning",
        title: `${product.name} is running low`,
        detail: `Only ${product.stock} left in stock.`,
        tab: "products",
      });
    }
  });

  customers.forEach((customer) => {
    if (customer.status !== "Pending") return;
    list.push({
      id: `customer-${customer.id}-pending`,
      kind: "customer",
      tone: "info",
      title: `${customer.name} is waiting for approval`,
      detail: "New customer account.",
      tab: "customers",
    });
  });

  return list.slice(0, MAX_NOTIFICATIONS);
}
