import Shopify from '@shopify/shopify-api';
import axios from 'axios';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_SHOP_NAME, SHOPIFY_API_VERSION } from 'src/shared/constants/index';
import { Order, Product, InventoryItem } from 'src/shared/types/index';
import { handleApiError } from 'src/shared/utils/index';

export class ShopifyIntegration {
  private client: Shopify.Clients.Rest;

  constructor() {
    const session = new Shopify.Session.CustomSession(SHOPIFY_SHOP_NAME);
    this.client = new Shopify.Clients.Rest(SHOPIFY_SHOP_NAME, SHOPIFY_API_VERSION, {
      apiKey: SHOPIFY_API_KEY,
      apiSecretKey: SHOPIFY_API_SECRET,
      scopes: ['read_products', 'write_products', 'read_orders', 'write_orders', 'read_inventory', 'write_inventory'],
      hostName: SHOPIFY_SHOP_NAME,
      session: session,
    });
  }

  async getOrders(params?: object): Promise<Order[]> {
    try {
      const response = await this.client.get({
        path: 'orders',
        query: params,
      });

      const shopifyOrders = response.body.orders;
      return shopifyOrders.map(this.transformShopifyOrder);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getProducts(params?: object): Promise<Product[]> {
    try {
      const response = await this.client.get({
        path: 'products',
        query: params,
      });

      const shopifyProducts = response.body.products;
      return shopifyProducts.map(this.transformShopifyProduct);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateInventory(inventoryItems: InventoryItem[]): Promise<void> {
    try {
      for (const item of inventoryItems) {
        await this.client.post({
          path: `inventory_levels/set`,
          data: {
            location_id: item.location,
            inventory_item_id: item.id,
            available: item.quantity,
          },
        });
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createProduct(product: Product): Promise<Product> {
    try {
      const response = await this.client.post({
        path: 'products',
        data: this.transformProductToShopify(product),
      });

      return this.transformShopifyProduct(response.body.product);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateProduct(product: Product): Promise<Product> {
    try {
      const response = await this.client.put({
        path: `products/${product.shopifyProductId}`,
        data: this.transformProductToShopify(product),
      });

      return this.transformShopifyProduct(response.body.product);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.client.delete({
        path: `products/${productId}`,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      await this.client.put({
        path: `orders/${orderId}`,
        data: {
          order: {
            id: orderId,
            status: status,
          },
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  private transformShopifyOrder(shopifyOrder: any): Order {
    // Implement the logic to transform Shopify order to application Order type
    // This is a placeholder and should be implemented based on your Order type
    return {
      id: shopifyOrder.id,
      // ... map other fields
    };
  }

  private transformShopifyProduct(shopifyProduct: any): Product {
    // Implement the logic to transform Shopify product to application Product type
    // This is a placeholder and should be implemented based on your Product type
    return {
      id: shopifyProduct.id,
      // ... map other fields
    };
  }

  private transformProductToShopify(product: Product): any {
    // Implement the logic to transform application Product type to Shopify product data
    // This is a placeholder and should be implemented based on Shopify's expected format
    return {
      title: product.name,
      // ... map other fields
    };
  }
}