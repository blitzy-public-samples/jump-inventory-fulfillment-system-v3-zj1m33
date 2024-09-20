import { Request, Response } from 'express';
import { OrderService } from 'src/backend/services/orderService';
import { handleApiError } from 'src/shared/utils/index';
import { PaginatedResponse, Order } from 'src/shared/types/index';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = req.query.filters as Record<string, string>;

      const paginatedOrders: PaginatedResponse<Order> = await this.orderService.getOrders(page, limit, filters);
      res.status(200).json(paginatedOrders);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      // TODO: Implement input validation
      const createdOrder = await this.orderService.createOrder(orderData);
      res.status(201).json(createdOrder);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const updateData = req.body;
      // TODO: Implement input validation
      const updatedOrder = await this.orderService.updateOrder(orderId, updateData);
      if (!updatedOrder) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async fulfillOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const fulfilledOrder = await this.orderService.fulfillOrder(orderId);
      if (!fulfilledOrder) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(fulfilledOrder);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async syncOrdersWithShopify(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.orderService.syncOrdersWithShopify();
      res.status(200).json(result);
    } catch (error) {
      handleApiError(res, error);
    }
  }
}