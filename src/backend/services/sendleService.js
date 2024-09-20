const axios = require('axios');
const config = require('./config/sendle');
const logger = require('../utils/logger');
const CustomError = require('../utils/CustomError');

const SENDLE_API_URL = config.SENDLE_API_URL;
const SENDLE_API_KEY = config.SENDLE_API_KEY;

/**
 * Generates a shipping label using the Sendle API
 * @param {object} orderDetails - Details of the order for shipping label generation
 * @returns {Promise<object>} Shipping label data including tracking number and label URL
 */
async function generateShippingLabel(orderDetails) {
    try {
        // Validate input orderDetails
        if (!orderDetails || typeof orderDetails !== 'object') {
            throw new CustomError('Invalid order details', 400);
        }

        // Prepare request payload for Sendle API
        const payload = {
            // Add necessary fields from orderDetails
            // Example: pickup_address, delivery_address, parcel_contents, etc.
        };

        // Send POST request to Sendle API to create shipment
        const response = await axios.post(`${SENDLE_API_URL}/shipments`, payload, {
            headers: {
                'Authorization': `Bearer ${SENDLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Handle API response and extract label information
        const { tracking_number, label_url } = response.data;

        // Return shipping label data
        return {
            trackingNumber: tracking_number,
            labelUrl: label_url
        };
    } catch (error) {
        logger.error('Error generating shipping label:', error);
        throw new CustomError('Failed to generate shipping label', 500);
    }
}

/**
 * Retrieves tracking information for a given tracking number
 * @param {string} trackingNumber - The tracking number to retrieve information for
 * @returns {Promise<object>} Tracking information including status and events
 */
async function getTrackingInfo(trackingNumber) {
    try {
        // Validate input tracking number
        if (!trackingNumber || typeof trackingNumber !== 'string') {
            throw new CustomError('Invalid tracking number', 400);
        }

        // Send GET request to Sendle API to retrieve tracking information
        const response = await axios.get(`${SENDLE_API_URL}/tracking/${trackingNumber}`, {
            headers: {
                'Authorization': `Bearer ${SENDLE_API_KEY}`
            }
        });

        // Handle API response and extract tracking details
        const { status, events } = response.data;

        // Return tracking information
        return {
            status,
            events
        };
    } catch (error) {
        logger.error('Error retrieving tracking information:', error);
        throw new CustomError('Failed to retrieve tracking information', 500);
    }
}

/**
 * Cancels a shipment using the Sendle API
 * @param {string} shipmentId - The ID of the shipment to cancel
 * @returns {Promise<boolean>} True if cancellation was successful, false otherwise
 */
async function cancelShipment(shipmentId) {
    try {
        // Validate input shipment ID
        if (!shipmentId || typeof shipmentId !== 'string') {
            throw new CustomError('Invalid shipment ID', 400);
        }

        // Send DELETE request to Sendle API to cancel shipment
        const response = await axios.delete(`${SENDLE_API_URL}/shipments/${shipmentId}`, {
            headers: {
                'Authorization': `Bearer ${SENDLE_API_KEY}`
            }
        });

        // Handle API response and check for successful cancellation
        return response.status === 200;
    } catch (error) {
        logger.error('Error cancelling shipment:', error);
        throw new CustomError('Failed to cancel shipment', 500);
    }
}

/**
 * Estimates shipping cost for a given package and destination
 * @param {object} packageDetails - Details of the package for cost estimation
 * @returns {Promise<object>} Estimated shipping cost and available service levels
 */
async function estimateShippingCost(packageDetails) {
    try {
        // Validate input package details
        if (!packageDetails || typeof packageDetails !== 'object') {
            throw new CustomError('Invalid package details', 400);
        }

        // Prepare request payload for Sendle API
        const payload = {
            // Add necessary fields from packageDetails
            // Example: pickup_suburb, delivery_suburb, weight, dimensions, etc.
        };

        // Send POST request to Sendle API to get shipping quote
        const response = await axios.post(`${SENDLE_API_URL}/quote`, payload, {
            headers: {
                'Authorization': `Bearer ${SENDLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Handle API response and extract cost estimates
        const { total_cost, service_levels } = response.data;

        // Return shipping cost estimates and service levels
        return {
            totalCost: total_cost,
            serviceLevels: service_levels
        };
    } catch (error) {
        logger.error('Error estimating shipping cost:', error);
        throw new CustomError('Failed to estimate shipping cost', 500);
    }
}

module.exports = {
    generateShippingLabel,
    getTrackingInfo,
    cancelShipment,
    estimateShippingCost
};

// Human tasks:
// TODO: Implement proper error handling for various Sendle API error responses
// TODO: Add unit tests for generateShippingLabel function
// TODO: Implement caching mechanism to reduce API calls for frequently checked tracking numbers
// TODO: Add unit tests for getTrackingInfo function
// TODO: Implement logic to handle partial refunds for cancelled shipments
// TODO: Add unit tests for cancelShipment function
// TODO: Implement caching mechanism for frequently requested routes and package sizes
// TODO: Add unit tests for estimateShippingCost function
// TODO: Implement rate limiting to comply with Sendle API usage limits
// TODO: Set up monitoring and alerting for API errors and performance issues
// TODO: Create comprehensive documentation for this service module
// TODO: Implement integration tests with mock Sendle API responses