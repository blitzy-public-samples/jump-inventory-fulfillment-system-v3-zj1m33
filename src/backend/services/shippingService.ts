import { SendleIntegration } from 'src/backend/integrations/sendleIntegration';
import { Order } from 'src/backend/models/Order';
import { ShippingLabel, Address } from 'src/shared/types/index';
import { handleApiError } from 'src/shared/utils/index';

export class ShippingService {
  private sendleIntegration: SendleIntegration;

  constructor(sendleIntegration: SendleIntegration) {
    this.sendleIntegration = sendleIntegration;
  }

  async generateShippingLabel(orderId: string): Promise<ShippingLabel> {
    try {
      // Retrieve order details from the database
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Validate order status and shipping address
      if (order.status !== 'PROCESSING' || !order.shippingAddress) {
        throw new Error('Order is not ready for shipping label generation');
      }

      // Call Sendle API to generate shipping label
      const shippingLabel = await this.sendleIntegration.createShippingLabel(order);

      // Save shipping label information to the order
      await order.update({
        shippingLabel: shippingLabel,
        status: 'READY_TO_SHIP'
      });

      return shippingLabel;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTrackingInfo(orderId: string): Promise<object> {
    try {
      // Retrieve order details from the database
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Check if the order has a tracking number
      if (!order.trackingNumber) {
        throw new Error('Order does not have a tracking number');
      }

      // Call Sendle API to get tracking information
      const trackingInfo = await this.sendleIntegration.getTrackingInfo(order.trackingNumber);

      return trackingInfo;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async calculateShippingRates(orderId: string): Promise<object[]> {
    try {
      // Retrieve order details including items and shipping address
      const order = await Order.findByPk(orderId, { include: ['items'] });
      if (!order) {
        throw new Error('Order not found');
      }

      // Calculate package dimensions and weight
      const packageDetails = this.calculatePackageDetails(order);

      // Call Sendle API to get shipping rate quotes
      const shippingRates = await this.sendleIntegration.getShippingRates(packageDetails, order.shippingAddress);

      return shippingRates;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async validateAddress(address: Address): Promise<boolean> {
    try {
      // Call Sendle API to validate the address
      const isValid = await this.sendleIntegration.validateAddress(address);
      return isValid;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async cancelShipment(orderId: string): Promise<boolean> {
    try {
      // Retrieve order details from the database
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Check if the order has a shipping label
      if (!order.shippingLabel) {
        throw new Error('Order does not have a shipping label to cancel');
      }

      // Call Sendle API to cancel the shipment
      const isCancelled = await this.sendleIntegration.cancelShipment(order.shippingLabel.id);

      if (isCancelled) {
        // Update order status and remove shipping label information
        await order.update({
          shippingLabel: null,
          status: 'PROCESSING'
        });
      }

      return isCancelled;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  private calculatePackageDetails(order: Order): object {
    // Implementation of package dimension and weight calculation
    // This is a placeholder and should be implemented based on your specific requirements
    return {
      weight: order.items.reduce((total, item) => total + item.weight * item.quantity, 0),
      dimensions: {
        length: 30,
        width: 20,
        height: 10
      }
    };
  }
}