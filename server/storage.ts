import { 
  users, type User, type InsertUser,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  payments, type Payment, type InsertPayment
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Order related methods
  createOrder(order: Omit<InsertOrder, "userId"> & { userId: number | null }): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  
  // Order items related methods
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  
  // Payment related methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByOrderId(orderId: number): Promise<Payment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private payments: Map<number, Payment>;
  
  currentUserId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.payments = new Map();
    
    this.currentUserId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentPaymentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Order methods
  async createOrder(orderData: Omit<InsertOrder, "userId"> & { userId: number | null }): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    
    const order: Order = {
      id,
      userId: orderData.userId,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      status: orderData.status,
      createdAt: now
    };
    
    this.orders.set(id, order);
    return order;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  // Order items methods
  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    
    const orderItem: OrderItem = {
      id,
      orderId: orderItemData.orderId,
      productName: orderItemData.productName,
      quantity: orderItemData.quantity,
      price: orderItemData.price
    };
    
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  // Payment methods
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const now = new Date();
    
    const payment: Payment = {
      id,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod,
      status: paymentData.status,
      transactionId: paymentData.transactionId,
      createdAt: now
    };
    
    this.payments.set(id, payment);
    return payment;
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async getPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.orderId === orderId
    );
  }
}

export const storage = new MemStorage();
