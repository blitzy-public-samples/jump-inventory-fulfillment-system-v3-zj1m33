import { Request, Response } from 'express';
import { ShippingService } from 'src/backend/services/shippingService';
import { handleApiError } from 'src/shared/utils/index';
import { ShippingLabel, Address } from 'src/shared/types/index';

export class ShippingController {
  private shippingService: ShippingService;

  constructor(shippingService: ShippingService) {
    this.shippingService = shippingService;
  }

  async generateShippingLabel(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const shippingLabel: ShippingLabel = await this.shippingService.generateShippingLabel(orderId);
      res.status(200).json(shippingLabel);
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async getTrackingInfo(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const trackingInfo = await this.shippingService.getTrackingInfo(orderId);
      res.status(200).json(trackingInfo);
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async calculateShippingRates(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const shippingRates = await this.shippingService.calculateShippingRates(orderId);
      res.status(200).json(shippingRates);
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async validateAddress(req: Request, res: Response): Promise<void> {
    try {
      const address: Address = req.body;
      const isValid = await this.shippingService.validateAddress(address);
      res.status(200).json({ isValid });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  async cancelShipment(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.shippingService.cancelShipment(orderId);
      res.status(200).json({ success: result });
    } catch (error) {
      handleApiError(error, res);
    }
  }
}