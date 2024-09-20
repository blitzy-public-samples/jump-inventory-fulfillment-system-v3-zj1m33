// Define the OrderStatus enum representing all possible order statuses in the system
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FULFILLED = 'FULFILLED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  ON_HOLD = 'ON_HOLD',
  BACKORDERED = 'BACKORDERED'
}

// Define a record of human-readable labels for each order status
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.FULFILLED]: 'Fulfilled',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded',
  [OrderStatus.ON_HOLD]: 'On Hold',
  [OrderStatus.BACKORDERED]: 'Backordered'
};

/**
 * Function to get the human-readable label for an order status
 * @param status The OrderStatus to get the label for
 * @returns The human-readable label for the given order status
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

/**
 * Function to check if an order status is considered final (i.e., no further actions needed)
 * @param status The OrderStatus to check
 * @returns True if the status is final, false otherwise
 */
export function isOrderStatusFinal(status: OrderStatus): boolean {
  return [
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED
  ].includes(status);
}

// Human tasks:
// TODO: Review and confirm that all necessary order statuses are included in the OrderStatus enum
// TODO: Ensure that the ORDER_STATUS_LABELS object includes appropriate human-readable labels for all statuses
// TODO: Verify that the isOrderStatusFinal function correctly identifies all final statuses