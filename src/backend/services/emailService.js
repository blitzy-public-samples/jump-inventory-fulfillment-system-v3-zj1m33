const sgMail = require('@sendgrid/mail');
const sendgridConfig = require('../config/sendgrid');
const logger = require('../utils/logger');

const API_KEY = sendgridConfig.apiKey;

// Initialize the SendGrid email service with the API key
function initializeEmailService() {
  sgMail.setApiKey(API_KEY);
  logger.info('Email service initialized successfully');
}

// Send an email using the SendGrid service
async function sendEmail(emailOptions) {
  const { to, from, subject, text } = emailOptions;
  const message = { to, from, subject, text };

  try {
    await sgMail.send(message);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
}

// Send an order confirmation email to the customer
async function sendOrderConfirmation(orderDetails) {
  const { customerEmail, orderNumber, totalAmount, items } = orderDetails;

  const subject = `Order Confirmation - Order #${orderNumber}`;
  const text = `Thank you for your order #${orderNumber}. Your total amount is $${totalAmount}. 
  Items ordered: ${items.map(item => item.name).join(', ')}`;

  try {
    await sendEmail({
      to: customerEmail,
      from: 'orders@ourcompany.com',
      subject,
      text
    });
    logger.info(`Order confirmation sent for order #${orderNumber}`);
  } catch (error) {
    logger.error(`Error sending order confirmation: ${error.message}`);
    throw error;
  }
}

// Send a shipping notification email to the customer
async function sendShippingNotification(shippingDetails) {
  const { customerEmail, orderNumber, trackingNumber, estimatedDelivery } = shippingDetails;

  const subject = `Your Order #${orderNumber} Has Been Shipped`;
  const text = `Your order #${orderNumber} has been shipped. 
  Tracking number: ${trackingNumber}
  Estimated delivery: ${estimatedDelivery}`;

  try {
    await sendEmail({
      to: customerEmail,
      from: 'shipping@ourcompany.com',
      subject,
      text
    });
    logger.info(`Shipping notification sent for order #${orderNumber}`);
  } catch (error) {
    logger.error(`Error sending shipping notification: ${error.message}`);
    throw error;
  }
}

// Send a low stock alert email to the warehouse manager
async function sendLowStockAlert(stockDetails) {
  const { productName, currentStock, threshold } = stockDetails;

  const subject = `Low Stock Alert: ${productName}`;
  const text = `The stock level for ${productName} has fallen below the threshold.
  Current stock: ${currentStock}
  Threshold: ${threshold}
  Please restock as soon as possible.`;

  try {
    await sendEmail({
      to: 'warehouse@ourcompany.com',
      from: 'inventory@ourcompany.com',
      subject,
      text
    });
    logger.info(`Low stock alert sent for ${productName}`);
  } catch (error) {
    logger.error(`Error sending low stock alert: ${error.message}`);
    throw error;
  }
}

module.exports = {
  initializeEmailService,
  sendEmail,
  sendOrderConfirmation,
  sendShippingNotification,
  sendLowStockAlert
};

// Human tasks:
// TODO: Review and update email templates for branding consistency
// TODO: Implement email tracking and analytics
// TODO: Set up email bounce and complaint handling
// TODO: Create unit tests for email sending functions
// TODO: Implement rate limiting for email sending to prevent abuse