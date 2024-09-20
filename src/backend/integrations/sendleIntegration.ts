import axios from 'axios';
import { SENDLE_API_KEY, SENDLE_API_URL, SENDLE_API_VERSION } from 'src/shared/constants/index';
import { ShippingLabel, Address } from 'src/shared/types/index';
import { handleApiError } from 'src/shared/utils/index';

export class SendleIntegration {
  private apiKey: string;
  private apiUrl: string;
  private apiVersion: string;

  constructor() {
    this.apiKey = SENDLE_API_KEY;
    this.apiUrl = SENDLE_API_URL;
    this.apiVersion = SENDLE_API_VERSION;
  }

  async generateShippingLabel(shipmentDetails: object): Promise<ShippingLabel> {
    try {
      // Prepare the request payload with shipment details
      const payload = {
        ...shipmentDetails,
        api_key: this.apiKey,
      };

      // Make a POST request to Sendle API to create a shipment
      const response = await axios.post(`${this.apiUrl}/${this.apiVersion}/shipments`, payload);

      // Extract the shipping label information from the response
      const { tracking_number, label_url } = response.data;

      // Return the ShippingLabel object
      return {
        id: response.data.id,
        trackingNumber: tracking_number,
        labelUrl: label_url,
        createdAt: new Date(),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTrackingInfo(trackingNumber: string): Promise<object> {
    try {
      // Make a GET request to Sendle API with the tracking number
      const response = await axios.get(`${this.apiUrl}/${this.apiVersion}/tracking/${trackingNumber}`, {
        params: { api_key: this.apiKey },
      });

      // Extract and return the tracking information from the response
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async calculateShippingRates(shipmentDetails: object): Promise<object[]> {
    try {
      // Prepare the request payload with shipment details
      const payload = {
        ...shipmentDetails,
        api_key: this.apiKey,
      };

      // Make a POST request to Sendle API to get quote
      const response = await axios.post(`${this.apiUrl}/${this.apiVersion}/quote`, payload);

      // Extract and return the shipping rates from the response
      return response.data.quotes;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async validateAddress(address: Address): Promise<boolean> {
    try {
      // Prepare the request payload with address details
      const payload = {
        address,
        api_key: this.apiKey,
      };

      // Make a POST request to Sendle API for address validation
      const response = await axios.post(`${this.apiUrl}/${this.apiVersion}/address/validate`, payload);

      // Return true if address is valid, false otherwise
      return response.data.valid;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    try {
      // Make a POST request to Sendle API to cancel the shipment
      const response = await axios.post(`${this.apiUrl}/${this.apiVersion}/shipments/${shipmentId}/cancel`, {
        api_key: this.apiKey,
      });

      // Return true if cancellation was successful, false otherwise
      return response.data.cancelled;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}