// Import dotenv for environment variable management
import { config } from 'dotenv';

// Load environment variables
config();

// Define Shopify API configuration constants
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME;
const SHOPIFY_API_VERSION = '2023-04';
const SHOPIFY_SCOPES = ['read_products', 'write_products', 'read_orders', 'write_orders', 'read_inventory', 'write_inventory'];

// Create the Shopify configuration object
export const shopifyConfig = {
  apiKey: SHOPIFY_API_KEY,
  apiSecret: SHOPIFY_API_SECRET,
  shopName: SHOPIFY_SHOP_NAME,
  apiVersion: SHOPIFY_API_VERSION,
  scopes: SHOPIFY_SCOPES,
  hostName: `${SHOPIFY_SHOP_NAME}.myshopify.com`
};

/**
 * Generates the Shopify OAuth authorization URL
 * @param {string} redirectUri - The URI to redirect to after authorization
 * @returns {string} Shopify OAuth authorization URL
 */
export function getShopifyAuthUrl(redirectUri) {
  // Construct the base Shopify OAuth URL
  const baseUrl = `https://${shopifyConfig.shopName}.myshopify.com/admin/oauth/authorize`;

  // Append client_id (API key)
  const url = new URL(baseUrl);
  url.searchParams.append('client_id', shopifyConfig.apiKey);

  // Append redirect_uri
  url.searchParams.append('redirect_uri', encodeURIComponent(redirectUri));

  // Append scopes
  url.searchParams.append('scope', shopifyConfig.scopes.join(','));

  // Return the complete authorization URL
  return url.toString();
}

// Human tasks:
// TODO: Verify that all required Shopify API scopes are included in the SHOPIFY_SCOPES array
// TODO: Ensure that the SHOPIFY_API_VERSION is up to date with the latest stable Shopify API version
// TODO: Implement proper error handling for missing environment variables
// TODO: Consider implementing a function to validate the Shopify configuration before exporting