interface Order {
  orderId: string;
  items: { productId: string; quantity: number }[];
}

export interface OrderCreatedMessage {
  type: 'orderCreated';
  payload: Order;
}

export interface OrderCancelledMessage {
  type: 'orderCancelled';
  payload: {
    orderId: string;
  };
}

type AppMessage = OrderCreatedMessage | OrderCancelledMessage;

export class MessageBus {
  private subscribers: Record<string, ((message: any) => void)[]> = {};

  subscribe<K extends AppMessage['type'], M extends AppMessage & { type: K }>(
    type: K,
    subscriber: (message: M) => void,
  ): void {
    if (!this.subscribers[type]) {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(subscriber as (message: any) => void);
  }

  publish(message: AppMessage): void {
    const messageSubscribers = this.subscribers[message.type];
    if (messageSubscribers) {
      messageSubscribers.forEach((subscriber) => {
        subscriber(message);
      });
    }
  }
}

export class InventoryStockTracker {
  private createdOrders: Record<string, { productId: string; quantity: number }[]> = {};

  constructor(
    private bus: MessageBus,
    private stock: Record<string, number>,
  ) {
    this.subscribeToMessages();
  }

  private subscribeToMessages(): void {
    this.bus.subscribe<'orderCreated', OrderCreatedMessage>('orderCreated', (message) => {
      console.log('Received OrderCreatedMessage:', message.payload.orderId);
      this.createdOrders[message.payload.orderId] = message.payload.items;

      message.payload.items.forEach((item) => {
        const currentStock = this.getStock(item.productId);
        this.stock[item.productId] = Math.max(0, currentStock - item.quantity);
        console.log(`Stock updated for ${item.productId}: ${this.stock[item.productId]}`);
      });
    });

    this.bus.subscribe<'orderCancelled', OrderCancelledMessage>('orderCancelled', (message) => {
      console.log('Received OrderCancelledMessage:', message.payload.orderId);
      const cancelledItems = this.createdOrders[message.payload.orderId];

      if (cancelledItems) {
        cancelledItems.forEach((item) => {
          const currentStock = this.getStock(item.productId);
          this.stock[item.productId] = currentStock + item.quantity;
          console.log(`Stock restored for ${item.productId}: ${this.stock[item.productId]}`);
        });
      } else {
        console.warn(`Could not find details for cancelled order: ${message.payload.orderId}`);
      }
    });
  }

  getStock(productId: string): number {
    return this.stock[productId] || 0;
  }
}
