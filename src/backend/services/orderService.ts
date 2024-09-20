import { Order } from 'src/backend/models/Order';
import { OrderItem } from 'src/backend/models/OrderItem';
import { Product } from 'src/backend/models/Product';
import { InventoryItem } from 'src/backend/models/InventoryItem';
import { ShopifyIntegration } from 'src/backend/integrations/shopifyIntegration';
import { SendleIntegration } from 'src/backend/integrations/sendleIntegration';
import { OrderStatus, PaginatedResponse } from 'src/shared/types/index';
import { handleApiError } from 'src/shared/utils/index';
import { Transaction } from 'sequelize';

export class OrderService {
  private shopifyIntegration: ShopifyIntegration;
  private sendleIntegration: SendleIntegration;

  constructor(shopifyIntegration: ShopifyIntegration, sendleIntegration: SendleIntegration) {
    this.shopifyIntegration = shopifyIntegration;
    this.sendleIntegration = sendleIntegration;
  }

  async getOrders(page: number, limit: number, filters: object): Promise<PaginatedResponse<Order>> {
    try {
      const offset = (page - 1) * limit;
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      };

      const { count, rows } = await Order.findAndCountAll(queryOptions);

      return {
        data: rows,
        total: count,
        page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, include: [Product] }],
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createOrder(orderData: any): Promise<Order> {
    const transaction: Transaction = await Order.sequelize!.transaction();

    try {
      const order = await Order.create(orderData, { transaction });

      for (const item of orderData.items) {
        await OrderItem.create({
          ...item,
          orderId: order.id,
        }, { transaction });
      }

      const total = orderData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      await order.update({ totalAmount: total }, { transaction });

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async updateOrder(orderId: string, updateData: any): Promise<Order> {
    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      await order.update(updateData);
      return order;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async fulfillOrder(orderId: string): Promise<Order> {
    const transaction: Transaction = await Order.sequelize!.transaction();

    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, include: [Product] }],
        transaction,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Check inventory availability
      for (const item of order.OrderItems) {
        const inventoryItem = await InventoryItem.findOne({
          where: { productId: item.productId },
          transaction,
        });

        if (!inventoryItem || inventoryItem.quantity < item.quantity) {
          throw new Error(`Insufficient inventory for product ${item.productId}`);
        }
      }

      // Update inventory
      for (const item of order.OrderItems) {
        await InventoryItem.decrement('quantity', {
          by: item.quantity,
          where: { productId: item.productId },
          transaction,
        });
      }

      // Generate shipping label
      const shippingLabel = await this.sendleIntegration.generateShippingLabel(order);

      // Update order status
      await order.update({
        status: OrderStatus.FULFILLED,
        trackingNumber: shippingLabel.trackingNumber,
        fulfilledAt: new Date(),
      }, { transaction });

      // Update Shopify order status
      await this.shopifyIntegration.updateOrderStatus(order.shopifyOrderId, OrderStatus.FULFILLED);

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async syncOrdersWithShopify(): Promise<void> {
    try {
      const shopifyOrders = await this.shopifyIntegration.getOrders();

      for (const shopifyOrder of shopifyOrders) {
        const existingOrder = await Order.findOne({
          where: { shopifyOrderId: shopifyOrder.id },
        });

        if (existingOrder) {
          await this.updateOrder(existingOrder.id, shopifyOrder);
        } else {
          await this.createOrder(shopifyOrder);
        }
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }
}