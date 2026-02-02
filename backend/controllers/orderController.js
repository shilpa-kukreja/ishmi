import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import User from "../models/User.js";
import nodemailer from 'nodemailer';
import crypto from "crypto";
import axios from 'axios';

//global variables
const currency = "inr";
const deliveryCharge = 10;

console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);


const transporter = nodemailer.createTransport({
  // Your email configuration
  service: 'gmail', // or other service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
//gateway  initialize
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//placing order cod method

const placeOrder = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { userId, items, amount, address, couponCode, discount, Shipping } = req.body;
    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "No items provided in the order",
      });
    }

    // Generate unique order ID
    const uniqueOrderId = `COD-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    console.log("Items to Save:", items);
    const orderData = {
      orderid: uniqueOrderId,
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      couponCode,
      discount,
      Shipping,
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Format date
    const orderDate = new Date(newOrder.date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });

    // Calculate total savings
    const totalSavings = newOrder.items.reduce((sum, item) => {
      return sum + (item.actualprice - item.discountedprice) * item.quantity;
    }, 0);

    // Generate items HTML
    const itemsHTML = newOrder.items.map(item => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 15px 0; text-align: center;">
          ${item.image ?
        (item.type === 'combo' ?
          `<img src="${process.env.BACKEND_URL}/uploads/thumbImg/${item.image}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">` :
          (Array.isArray(item.image) ?
            `<img src="${process.env.BACKEND_URL}${item.image[0]?.url || item.image[0]}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">` :
            `<img src="${process.env.BACKEND_URL}${item.image}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">`
          )
        )
        :
        '<div style="width: 80px; height: 80px; background: #f5f5f5; display: inline-block; border-radius: 4px;"></div>'}
        </td>
        <td style="padding: 15px 0;">
          <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
          ${item.size ? `<div style="color: #666; font-size: 13px; margin-bottom: 5px;">Size: ${item.size}</div>` : ''}
          <div style="color: #666; font-size: 13px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 15px 0; text-align: right;">
          <div style="font-weight: 600;">₹${item.discountedprice * item.quantity}</div>
          ${item.actualprice > item.discountedprice ?
        `<div style="color: #666; font-size: 13px; text-decoration: line-through;">₹${item.actualprice * item.quantity}</div>` : ''}
        </td>
      </tr>
    `).join('');

    // Customer email template
    const customerMailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation #${newOrder._id.toString().slice(-8)} (COD)`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Order Confirmation</title>
          <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e0e0e0; }
              .logo { max-width: 150px; }
              .thank-you { font-size: 24px; color: #2e7d32; margin: 20px 0; }
              .order-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-weight: bold; }
              .section-title { font-size: 18px; margin: 25px 0 15px 0; color: #2e7d32; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
              .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .info-table td { padding: 8px 0; vertical-align: top; }
              .items-table { width: 100%; border-collapse: collapse; }
              .total-row { font-weight: bold; font-size: 16px; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px; }
          </style>
      </head>
      <body>
          <div class="header">
              <img src="https://yourstore.com/logo.png" alt="Your Store Logo" class="logo">
          </div>
          
          <div class="thank-you">Thank you for your order, ${newOrder.address.firstName}!</div>
          <p>Your order has been confirmed and will be processed shortly. Please pay <strong>₹${newOrder.amount.toFixed(2)}</strong> when your order is delivered.</p>
          
          <div class="section-title">Order Summary</div>
          <table class="info-table">
              <tr>
                  <td>Order ID:</td>
                  <td>${newOrder._id.toString().slice(-8)}</td>
              </tr>
              <tr>
                  <td>Amount to Pay:</td>
                  <td>₹${newOrder.amount.toFixed(2)}</td>
              </tr>
              <tr>
                  <td>Payment Method:</td>
                  <td>Cash on Delivery (COD)</td>
              </tr>
              <tr>
                  <td>Payment Status:</td>
                  <td>Pending</td>
              </tr>
              <tr>
                  <td>Order Date:</td>
                  <td>${orderDate}</td>
              </tr>
              ${totalSavings > 0 ? `
              <tr>
                  <td>Total Savings:</td>
                  <td style="color: #2e7d32;">₹${totalSavings.toFixed(2)}</td>
              </tr>` : ''}
          </table>
          
          <div class="section-title">Shipping Details</div>
          <table class="info-table">
              <tr>
                  <td colspan="2">
                      ${newOrder.address.firstName} ${newOrder.address.lastName}<br>
                      ${newOrder.address.street}<br>
                      ${newOrder.address.city}, ${newOrder.address.state}<br>
                      ${newOrder.address.country} - ${newOrder.address.zipcode}<br>
                      Phone: ${newOrder.address.phone}
                  </td>
              </tr>
          </table>
          
          <div class="section-title">Items Ordered</div>
          <table class="items-table">
              <thead>
                  <tr style="border-bottom: 2px solid #e0e0e0;">
                      <th style="text-align: left; padding-bottom: 10px; width: 100px;">Image</th>
                      <th style="text-align: left; padding-bottom: 10px;">Item</th>
                      <th style="text-align: right; padding-bottom: 10px;">Price</th>
                  </tr>
              </thead>
              <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                      <td colspan="2" style="padding-top: 15px; text-align: right;">Total:</td>
                      <td style="padding-top: 15px; text-align: right;">₹${newOrder.amount.toFixed(2)}</td>
                  </tr>
              </tbody>
          </table>
          
          <p style="margin-top: 25px;">We've received your order and will process it shortly. You'll receive another email when your items ship.</p>
          
          <div class="footer">
              <p>If you have any questions, please contact us at support@yourstore.com</p>
              <p>© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          </div>
      </body>
      </html>
      `
    };

    // Admin notification email
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New COD Order #${newOrder._id.toString().slice(-8)} - ₹${newOrder.amount.toFixed(2)}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">New COD Order Received</h2>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Customer:</strong> ${newOrder.address.firstName} ${newOrder.address.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> ₹${newOrder.amount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
          <p><strong>Items:</strong> ${newOrder.items.length} items</p>
          <p><strong>Shipping to:</strong> ${newOrder.address.street}, ${newOrder.address.city}, ${newOrder.address.state} - ${newOrder.address.zipcode}</p>
          <p><strong>Contact:</strong> ${newOrder.address.phone}</p>
          <p style="margin-top: 20px;"><a href="https://yourstore.com/admin/orders/${newOrder._id}" style="background: #2e7d32; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">View Order in Dashboard</a></p>
      </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    res.json({ success: true, message: "Order Placed", orderid: uniqueOrderId, });
  } catch (error) {
    console.log(error);

    // Send error notification to admin if something goes wrong
    const errorMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Order Placement Error',
      text: `An error occurred while placing a COD order: ${error.message}`
    };

    try {
      await transporter.sendMail(errorMailOptions);
    } catch (emailError) {
      console.error('Failed to send error email:', emailError);
    }

    res.json({
      success: false,
      message: error.message || 'Error while placing order'
    });
  }
};

//Placing order Razorpay method

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode, discount, Shipping } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
      couponCode,
      discount,
      Shipping,
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };
    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    // Fetch order details from Razorpay
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // Find the user and order in database
    const user = await User.findById(userId);
    const order = await orderModel.findById(orderInfo.receipt);

    if (!user || !order) {
      throw new Error('User or Order not found');
    }

    if (orderInfo.status === "paid") {
      // Update order and user cart
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
        status: 'paid'
      });

      await User.findByIdAndUpdate(userId, { cartData: {} });

      // Format date
      const orderDate = new Date(order.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });

      // Calculate total savings
      const totalSavings = order.items.reduce((sum, item) => {
        return sum + (item.actualprice - item.discountedprice) * item.quantity;
      }, 0);

      // Generate items HTML
      const itemsHTML = order.items.map(item => `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 0; text-align: center;">
  ${item.image ?
          (item.type === 'combo' ?
            `<img src="${process.env.BACKEND_URL}/uploads/thumbImg/${item.image}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">` :
            (Array.isArray(item.image) ?
              `<img src="${process.env.BACKEND_URL}${item.image[0]?.url || item.image[0]}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">` :
              `<img src="${process.env.BACKEND_URL}${item.image}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">`
            )
          )
          :
          '<div style="width: 80px; height: 80px; background: #f5f5f5; display: inline-block; border-radius: 4px;"></div>'}
</td>
          <td style="padding: 15px 0;">
            <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
            ${item.size ? `<div style="color: #666; font-size: 13px; margin-bottom: 5px;">Size: ${item.size}</div>` : ''}
            <div style="color: #666; font-size: 13px;">Qty: ${item.quantity}</div>
          </td>
          <td style="padding: 15px 0; text-align: right;">
            <div style="font-weight: 600;">₹${item.discountedprice * item.quantity}</div>
            ${item.actualprice > item.discountedprice ?
          `<div style="color: #666; font-size: 13px; text-decoration: line-through;">₹${item.actualprice * item.quantity}</div>` : ''}
          </td>
        </tr>
      `).join('');

      // Customer email template
      const customerMailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Order Confirmation</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e0e0e0; }
                .logo { max-width: 150px; }
                .thank-you { font-size: 24px; color: #2e7d32; margin: 20px 0; }
                .order-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-weight: bold; }
                .section-title { font-size: 18px; margin: 25px 0 15px 0; color: #2e7d32; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
                .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .info-table td { padding: 8px 0; vertical-align: top; }
                .items-table { width: 100%; border-collapse: collapse; }
                .total-row { font-weight: bold; font-size: 16px; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="https://yourstore.com/logo.png" alt="Your Store Logo" class="logo">
            </div>
            
            <div class="thank-you">Thank you for your purchase, ${order.address.firstName}!</div>
            <p>Your order has been confirmed and payment was successful.</p>
            
            <div class="section-title">Order Summary</div>
            <table class="info-table">
                <tr>
                    <td>Order ID:</td>
                    <td>${order._id.toString().slice(-8)}</td>
                </tr>
                <tr>
                    <td>Amount Paid:</td>
                    <td>₹${order.amount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Payment Method:</td>
                    <td>${order.paymentMethod}</td>
                </tr>
                <tr>
                    <td>Payment Status:</td>
                    <td>Paid</td>
                </tr>
                <tr>
                    <td>Order Date:</td>
                    <td>${orderDate}</td>
                </tr>
                ${totalSavings > 0 ? `
                <tr>
                    <td>Total Savings:</td>
                    <td style="color: #2e7d32;">₹${totalSavings.toFixed(2)}</td>
                </tr>` : ''}
            </table>
            
            <div class="section-title">Shipping Details</div>
            <table class="info-table">
                <tr>
                    <td colspan="2">
                        ${order.address.firstName} ${order.address.lastName}<br>
                        ${order.address.street}<br>
                        ${order.address.city}, ${order.address.state}<br>
                        ${order.address.country} - ${order.address.zipcode}<br>
                        Phone: ${order.address.phone}
                    </td>
                </tr>
            </table>
            
            <div class="section-title">Items Ordered</div>
            <table class="items-table">
                <thead>
                    <tr style="border-bottom: 2px solid #e0e0e0;">
                        <th style="text-align: left; padding-bottom: 10px; width: 100px;">Image</th>
                        <th style="text-align: left; padding-bottom: 10px;">Item</th>
                        <th style="text-align: right; padding-bottom: 10px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                    <tr class="total-row">
                        <td colspan="2" style="padding-top: 15px; text-align: right;">Total:</td>
                        <td style="padding-top: 15px; text-align: right;">₹${order.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            
            <p style="margin-top: 25px;">We've received your order and will process it shortly. You'll receive another email when your items ship.</p>
            
            <div class="footer">
                <p>If you have any questions, please contact us at support@yourstore.com</p>
                <p>© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
            </div>
        </body>
        </html>
        `
      };

      // Admin notification email (simplified version)
      const adminMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order #${order._id.toString().slice(-8)} - ₹${order.amount.toFixed(2)}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">New Order Received</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Customer:</strong> ${order.address.firstName} ${order.address.lastName} (${order.address.email})</p>
            <p><strong>Amount:</strong> ₹${order.amount.toFixed(2)}</p>
            <p><strong>Items:</strong> ${order.items.length} items</p>
            <p><strong>Shipping to:</strong> ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}</p>
            <p><strong>Contact:</strong> ${order.address.phone}</p>
            <p style="margin-top: 20px;"><a href="https://yourstore.com/admin/orders/${order._id}" style="background: #2e7d32; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">View Order in Dashboard</a></p>
        </div>
        `
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(customerMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);

      res.json({ success: true, message: "Payment Successful" });
    } else {
      // Payment failed email (same as before)
      const failedMailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Payment Failed - Order Not Processed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f44336;">Payment Failed</h2>
            <p>Dear ${user.name},</p>
            <p>We couldn't process your payment for Order #${order._id}.</p>
            <p><strong>Reason:</strong> ${orderInfo.error_description || 'Payment not completed'}</p>
            <p>Please try again or contact support if you believe this is an error.</p>
            <p>You can retry the payment from your order history.</p>
            <p>Thank you,<br>Your Store Team</p>
          </div>
        `
      };

      await transporter.sendMail(failedMailOptions);
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    const errorMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Payment Verification Error',
      text: `An error occurred during payment verification: ${error.message}`
    };
    try {
      await transporter.sendMail(errorMailOptions);
    } catch (emailError) {
      console.error('Failed to send error email:', emailError);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};





const PAYU_CONFIG = {
  key: process.env.PAYU_MERCHANT_KEY || 'uVFpFdVT',
  salt: process.env.PAYU_SALT || '63x3e0I1u9',
  testMode: process.env.PAYU_MODE === 'test' || process.env.NODE_ENV !== 'production',
  baseUrl: process.env.PAYU_MODE === 'test'
    ? 'https://secure.payu.in'
    : 'https://secure.payu.in',
  endpoints: {
    initiate: '/_payment',
    verify: '/merchant/postservice?form=2'
  }
};




const generatePayUHash = (params) => {
  // PayU expects: hash = sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
  const data = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|${params.udf1 || ''}|${params.udf2 || ''}|${params.udf3 || ''}|${params.udf4 || ''}|${params.udf5 || ''}||||||${PAYU_CONFIG.salt}`;

  console.log("Hash generation string:", data);

  const hash = crypto.createHash('sha512').update(data).digest("hex")
    .toLowerCase();;
  console.log("Generated hash:", hash);

  return hash;
};

// Generate transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
};


const initiatePayUPayment = async (req, res) => {
  try {

    const { userId, items, amount, address, couponCode, discount, Shipping } = req.body;

    console.log("Received order data:", {
      userId,
      amount,
      itemsCount: items?.length,
      address: address?.firstName,
      Shipping
    });

    // Create order record
    const orderData = {
      userId,
      items,
      amount: parseFloat(amount).toFixed(2),
      address,
      paymentMethod: "PayU",
      payment: false,
      paymentStatus: 'pending',
      date: Date.now(),
      couponCode,
      discount,
      Shipping,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log("Order saved with ID:", newOrder._id);

    // Generate transaction ID
    const txnid = generateTransactionId();
    console.log("Generated transaction ID:", txnid);

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Prepare PayU parameters - STRING VALUES ONLY
    const payUParams = {
      key: PAYU_CONFIG.key,
      txnid: txnid,
      amount: parseFloat(amount).toFixed(2), // Ensure 2 decimal places
      productinfo: `Order #${newOrder._id.toString().slice(-8)}`,
      firstname: address.firstName.trim(),
      email: (address.email || user.email).trim(),
      phone: (address.phone || user.phone || '0000000000').trim(),

      surl: `${process.env.BACKEND_URL}/api/order/payu/verify`,
      furl: `${process.env.BACKEND_URL}/api/order/payu/verify`,
      curl: `${process.env.BACKEND_URL}/api/order/payu/verify`,
      address1: (address.street || '').trim(),
      address2: `${address.city || ''}, ${address.state || ''}`.trim(),
      city: (address.city || '').trim(),
      state: (address.state || '').trim(),
      country: (address.country || 'India').trim(),
      zipcode: (address.zipcode || '').trim(),
      udf1: newOrder._id.toString(), // Order ID
      udf2: userId.toString(), // User ID
      udf3: '', // Optional
      udf4: '', // Optional
      udf5: '', // Optional
      hash: '' // Will be calculated
    };

    // Log parameters for debugging
    console.log("PayU Parameters before hash:", JSON.stringify(payUParams, null, 2));

    // Generate hash
    const calculatedHash = generatePayUHash(payUParams);
    payUParams.hash = calculatedHash;

    // Update order with transaction ID
    await orderModel.findByIdAndUpdate(newOrder._id, {
      transactionId: txnid
    });

    // Return payment parameters to frontend
    res.json({
      success: true,
      paymentData: {
        ...payUParams,
        action: `${PAYU_CONFIG.baseUrl}${PAYU_CONFIG.endpoints.initiate}`,
        method: 'POST'
      },
      orderId: newOrder._id,
      transactionId: txnid
    });

  } catch (error) {
    console.error('PayU Initiation Error:', error);

    // Send detailed error to frontend for debugging
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};







// Generate invoice PDF (simplified version)
const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
  

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }


    // Create a simple invoice HTML
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - Order ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>Order #${order._id}</p>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
          </div>
          
          <div class="details">
            <h3>Bill To:</h3>
            <p>${order.address.firstName} ${order.address.lastName}</p>
            <p>${order.address.street}</p>
            <p>${order.address.city}, ${order.address.state} ${order.address.zipcode}</p>
            <p>Email: ${order.address.email}</p>
            <p>Phone: ${order.address.phone}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.discountedprice}</td>
                  <td>₹${(item.discountedprice * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <p><strong>Total: ₹${order.amount.toFixed(2)}</strong></p>
            <p>Payment Method: ${order.paymentMethod}</p>
            <p>Status: ${order.payment ? 'Paid' : 'Pending'}</p>
          </div>
        </body>
      </html>
    `;

    // Return as PDF (in production, use a library like pdfkit or puppeteer)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    // For now, return HTML. In production, convert to PDF
    res.send(invoiceHTML);

  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice"
    });
  }
};

// const verifyPayUPayment = async (req, res) => {
//   try {
//     console.log("PayU Verification Headers:", req.headers['content-type']);
//     console.log("PayU Verification Body (raw):", req.body);
//     console.log("PayU Verification Query Params:", req.query);

//     // Try to get data from different sources (form, JSON, query)
//     let verificationData;

//     if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
//       // PayU sends form data
//       verificationData = req.body;
//       console.log("Processing as form data:", verificationData);
//     } else if (req.headers['content-type']?.includes('application/json')) {
//       // Direct JSON (for testing)
//       verificationData = req.body;
//       console.log("Processing as JSON data:", verificationData);
//     } else {
//       // Try query params as fallback
//       verificationData = req.query;
//       console.log("Processing as query params:", verificationData);
//     }



//     const { txnid, status, hash, udf1, mihpayid, email, firstname, productinfo, amount } = verificationData;

//     console.log("Extracted verification data:", {
//       txnid,
//       status,
//       hash,
//       udf1,
//       mihpayid,
//       email,
//       firstname,
//       productinfo,
//       amount
//     });

//     const orderId = udf1;

//     if (!orderId) {
//       throw new Error('Order ID not found in verification data');
//     }

//     // Find the order
//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       throw new Error('Order not found with ID: ' + orderId);
//     }

//     // Get user details for email verification
//     const user = await User.findById(order.userId);
//     const userEmail = user?.email || order.address.email;
//     const userName = order.address.firstName || firstname;
//     const orderAmount = order.amount || amount;

//     // Generate reverse hash - FIXED: Use proper variable names
//     const reverseHashString = `${PAYU_CONFIG.salt}|${status}|||||||||||${userEmail}|${userName}|${order.items.map(i => i.name).join(', ')}|${orderAmount}|${txnid}|${PAYU_CONFIG.key}`;

//     console.log("Reverse hash string:", reverseHashString);

//     const generatedHash = crypto
//       .createHash("sha512")
//       .update(reverseHashString)
//       .digest("hex");

//     console.log("Generated hash:", generatedHash);
//     console.log("Received hash:", hash);

//     if (hash !== generatedHash) {
//       console.warn('Hash verification failed. This could be a test transaction or hash mismatch.');
//       // Continue anyway for testing, but log it

//     }

//     // Update order based on status
//     if (status === 'success') {
//       // Payment successful
//       await orderModel.findByIdAndUpdate(orderId, {
//         payment: true,
//         paymentStatus: 'paid',
//         status: 'processing',
//         transactionId: txnid,
//         paymentId: mihpayid,
//         updatedAt: Date.now()
//       });

//       // Clear user's cart
//       await User.findByIdAndUpdate(order.userId, { cartData: {} });

//       // Send confirmation email
//       await sendOrderConfirmationEmail(order);

//       // Redirect to success page
//       res.redirect(`${process.env.FRONTEND_URL}/order-success?orderId=${orderId}&txnid=${txnid}`);

//     } else {
//       // Payment failed
//       await orderModel.findByIdAndUpdate(orderId, {
//         paymentStatus: 'failed',
//         status: 'cancelled',
//         transactionId: txnid,
//         updatedAt: Date.now()
//       });

//       res.redirect(`${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&status=${status}`);
//     }

//   } catch (error) {
//     console.error('PayU Verification Error:', error);

//     // Send error email to admin
//     const errorMailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: process.env.ADMIN_EMAIL,
//       subject: 'PayU Verification Error',
//       text: `Error: ${error.message}\n\nFull Error: ${error.stack}\n\nRequest Body: ${JSON.stringify(req.body, null, 2)}`
//     };

//     try {
//       await transporter.sendMail(errorMailOptions);
//     } catch (emailError) {
//       console.error('Failed to send error email:', emailError);
//     }

//     res.redirect(`${process.env.FRONTEND_URL}/order-error?error=${encodeURIComponent(error.message)}`);
//   }
// };
// Webhook for PayU (for additional verification)



// const verifyPayUPayment = async (req, res) => {
//   try {
//     console.log("PayU Verification Headers:", req.headers['content-type']);
//     console.log("PayU Verification Body (raw):", req.body);

//     let verificationData = req.body;

//     // Extract ALL udf fields properly
//     const {
//       txnid,
//       status,
//       hash,
//       udf1,
//       udf2,
//       udf3,
//       udf4,
//       udf5,
//       mihpayid,
//       email,
//       firstname,
//       productinfo,
//       amount,
//       key,
//       error,
//       error_Message,
//       bankcode,
//       bank_ref_num,
//       net_amount_debit,
//       mode,
//       PG_TYPE,
//       payment_source
//     } = verificationData;

//     console.log("Extracted verification data:", {
//       txnid,
//       status,
//       hash,
//       udf1,
//       udf2,
//       udf3,
//       udf4,
//       udf5,
//       mihpayid,
//       email,
//       firstname,
//       productinfo,
//       amount,
//       key,
//       error
//     });


//     console.log('verificationData' , verificationData);

//     const orderId = udf1;

//     if (!orderId) {
//       throw new Error('Order ID not found in verification data');
//     }

//     // Find the order
//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       throw new Error('Order not found with ID: ' + orderId);
//     }

//     // Get user details
//     const user = await User.findById(order.userId);

//     // CORRECT HASH VERIFICATION FOR PAYU
//     // According to PayU documentation, the response hash verification string is:
//     // hash = sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)

//     // Let's build the verification string EXACTLY as PayU expects
//     // const verifyString = `${PAYU_CONFIG.salt}|${status}|||||||${udf5 || ''}|${udf4 || ''}|${udf3 || ''}|${udf2 || ''}|${udf1 || ''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.key}`;


//     const verifyString =
//     `${PAYU_CONFIG.salt}|` +
//     `${status}|||||||` +
//     `${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|` +
//     `${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.key}`;

//     console.log("Verify string:", verifyString);

//     const generatedHash = crypto
//       .createHash("sha512")
//       .update(verifyString)
//       .digest("hex")
//       .toLowerCase();

//     console.log("Generated hash:", generatedHash);
//     console.log("Received hash:", hash);

//     // IMPORTANT: PayU test environment might not match hash exactly
//     // For now, proceed based on status if in test mode
//     let hashValid = hash === generatedHash;

//     if (!hashValid && PAYU_CONFIG.testMode) {
//       console.warn('Hash verification failed, but proceeding in test mode');
//       console.log('Status is:', status);
//       // In test mode, we can proceed based on status
//       hashValid = true;
//     }

//     if (!hashValid) {
//       // Try alternative hash format (some implementations)
//       const altVerifyString = `${PAYU_CONFIG.salt}|${status}||||||||||${udf1 || ''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.key}`;
//       const altHash = crypto.createHash("sha512").update(altVerifyString).digest("hex");

//       console.log("Alternative verify string:", altVerifyString);
//       console.log("Alternative hash:", altHash);

//       if (hash === altHash) {
//         hashValid = true;
//         console.log("Alternative hash matched!");
//       } else {
//         console.error('Hash verification failed completely');
//         console.log('Hash comparison failed:', {
//           generatedHashLength: generatedHash.length,
//           receivedHashLength: hash.length,
//           generatedHashStart: generatedHash.substring(0, 20),
//           receivedHashStart: hash.substring(0, 20)
//         });

//         // Still proceed if status is success (for now, for testing)
//         if (status === 'success') {
//           console.warn('Proceeding with payment despite hash mismatch (test mode)');
//           hashValid = true;
//         }
//       }
//     }

//     if (!hashValid) {
//       console.error('Hash verification failed and status not success');
//       await orderModel.findByIdAndUpdate(orderId, {
//         paymentStatus: 'hash_failed',
//         status: 'failed',
//         transactionId: txnid,
//         updatedAt: Date.now()
//       });

//       return res.redirect(`${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&reason=hash_mismatch`);
//     }

//     // In verifyPayUPayment function, update the order update section:
//     if (status === 'success') {
//       // Payment successful
//       const updateData = {
//         payment: true,
//         paymentStatus: 'paid',
//         status: 'processing',
//         transactionId: txnid,
//         paymentId: mihpayid,
//         netAmountDebit: net_amount_debit,
//         bankCode: bankcode,
//         bankRefNum: bank_ref_num,
//         paymentResponse: {
//           errorCode: error,
//           errorMessage: error_Message,
//           paymentMode: mode,
//           pgType: PG_TYPE,
//           paymentSource: payment_source
//         },
//         updatedAt: Date.now()
//       };

//       console.log("Updating order with data:", updateData);

//       await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });

//       // Clear user's cart
//       await User.findByIdAndUpdate(order.userId, { cartData: {} });

//       // Send confirmation emails
//       await sendOrderConfirmationEmail(order, user);

//       // Log success
//       console.log(`Payment successful for order ${orderId}, transaction ${txnid}`);

//       // Redirect to success page with parameters
//       const successUrl = `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}&txnid=${txnid}&status=success&amount=${amount}`;
//       console.log("Redirecting to:", successUrl);
//       return res.redirect(successUrl);
    

//   } else {
//     // Payment failed
//     await orderModel.findByIdAndUpdate(orderId, {
//       paymentStatus: 'failed',
//       status: 'cancelled',
//       transactionId: txnid,
//       paymentResponse: {
//         errorCode: error,
//         errorMessage: error_Message,
//         status: status
//       },
//       updatedAt: Date.now()
//     });

//     // Send failure email
//     await sendPaymentFailedEmail(order, user, error_Message);

//     const failUrl = `${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&status=${status}&error=${encodeURIComponent(error_Message || 'Payment failed')}`;
//     console.log("Redirecting to failure page:", failUrl);
//     return res.redirect(failUrl);
//   }

// } catch (error) {
//   console.error('PayU Verification Error:', error);

//   // Send error email to admin
//   const errorMailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: process.env.ADMIN_EMAIL,
//     subject: 'PayU Verification Error',
//     text: `Error: ${error.message}\n\nFull Error: ${error.stack}\n\nRequest Body: ${JSON.stringify(req.body, null, 2)}`
//   };

//   try {
//     await transporter.sendMail(errorMailOptions);
//   } catch (emailError) {
//     console.error('Failed to send error email:', emailError);
//   }

//   const errorUrl = `${process.env.FRONTEND_URL}/order-error?error=${encodeURIComponent(error.message)}`;
//   return res.redirect(errorUrl);
// }
// };


// In your orderController.js, add this function:

// Public order status check (no auth required)
const getOrderPublic = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("Public order check for:", orderId);

    // Find the order
    let order;

    // First try to find by _id
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await orderModel.findById(orderId);
    }

    // If not found, try by transactionId
    if (!order) {
      order = await orderModel.findOne({ transactionId: orderId });
    }

    if (!order) {
      console.log("Order not found publicly:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Return only public information (no sensitive data)
    const publicOrder = {
      _id: order._id,
      orderid: order.orderid,
      transactionId: order.transactionId,
      amount: order.amount,
      status: order.status,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      date: order.date,
      // Minimal item info
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        discountedprice: item.discountedprice,
        actualprice: item.actualprice
      })),
      // Only basic address info
      address: {
        firstName: order.address?.firstName,
        lastName: order.address?.lastName,
        city: order.address?.city,
        state: order.address?.state
      }
    };

    res.json({
      success: true,
      order: publicOrder,
      message: "Order retrieved successfully"
    });

  } catch (error) {
    console.error("Error in getOrderPublic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details"
    });
  }
};

// const verifyPayUPayment = async (req, res) => {
//   try {
//     console.log("PayU Verification Headers:", req.headers['content-type']);
//     console.log("PayU Verification Body (raw):", req.body);

//     let verificationData = req.body;

//     // Extract ALL fields
//     const {
//       txnid,
//       status,
//       hash,
//       udf1,
//       udf2,
//       udf3,
//       udf4,
//       udf5,
//       mihpayid,
//       email,
//       firstname,
//       productinfo,
//       amount,
//       key,
//       error,
//       error_Message,
//       bankcode,
//       bank_ref_num,
//       net_amount_debit,
//       mode,
//       PG_TYPE,
//       payment_source
//     } = verificationData;

//     console.log("Extracted verification data:", {
//       txnid,
//       status,
//       hash,
//       udf1,
//       udf2,
//       udf3,
//       udf4,
//       udf5,
//       mihpayid,
//       email,
//       firstname,
//       productinfo,
//       amount,
//       key
//     });

//     const orderId = udf1;

//     if (!orderId) {
//       throw new Error('Order ID not found in verification data');
//     }

//     // Find the order
//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       throw new Error('Order not found with ID: ' + orderId);
//     }

//     // Get user details
//     const user = await User.findById(order.userId);

//     // CORRECT HASH VERIFICATION FOR PAYU RESPONSE
//     // According to PayU documentation, the response hash verification string is:
//     // hash = sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    
//     // Note the exact format: 6 pipes after status, then udf5-udf1 in reverse order
//     const verifyString = 
//       `${PAYU_CONFIG.salt}|` +
//       `${status}|` +
//       `|||||` +  // 5 empty fields after status
//       `${udf5 || ''}|` +
//       `${udf4 || ''}|` +
//       `${udf3 || ''}|` +
//       `${udf2 || ''}|` +
//       `${udf1 || ''}|` +
//       `${email}|` +
//       `${firstname}|` +
//       `${productinfo}|` +
//       `${amount}|` +
//       `${txnid}|` +
//       `${key}`;

//     console.log("Verify string for hash generation:", verifyString);

//     // Generate hash in lowercase
//     const generatedHash = crypto
//       .createHash("sha512")
//       .update(verifyString)
//       .digest("hex")
//       .toLowerCase();

//     console.log("Generated hash:", generatedHash);
//     console.log("Received hash:", hash ? hash.toLowerCase() : 'No hash received');

//     let hashValid = false;
    
//     // Compare hashes (both in lowercase for consistency)
//     if (hash && generatedHash === hash.toLowerCase()) {
//       hashValid = true;
//       console.log("Hash verification SUCCESSFUL");
//     } else {
//       console.warn("Hash verification FAILED");
//       console.log({
//         generatedHash: generatedHash,
//         receivedHash: hash ? hash.toLowerCase() : 'undefined',
//         lengthMatch: hash ? generatedHash.length === hash.length : false
//       });

//       // In test mode, we might accept if status is success
//       if (PAYU_CONFIG.testMode && status === 'success') {
//         console.warn("Proceeding with payment despite hash mismatch (TEST MODE)");
//         hashValid = true;
//       }
//     }

//     if (!hashValid) {
//       console.error('Hash verification failed and status not success');
//       await orderModel.findByIdAndUpdate(orderId, {
//         paymentStatus: 'hash_failed',
//         status: 'failed',
//         transactionId: txnid,
//         paymentResponse: {
//           hashMismatch: true,
//           generatedHash: generatedHash,
//           receivedHash: hash
//         },
//         updatedAt: Date.now()
//       });

//       return res.redirect(`${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&reason=hash_mismatch&status=${status}`);
//     }

//     // Handle successful payment
//     if (status === 'success') {
//       // Payment successful
//       const updateData = {
//         payment: true,
//         paymentStatus: 'paid',
//         status: 'processing',
//         transactionId: txnid,
//         paymentId: mihpayid,
//         netAmountDebit: net_amount_debit,
//         bankCode: bankcode,
//         bankRefNum: bank_ref_num,
//         paymentResponse: verificationData, // Store entire response
//         updatedAt: Date.now(),
//         hashVerified: hashValid
//       };

//       console.log("Updating order with data:", updateData);

//       await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });

//       // Clear user's cart
//       await User.findByIdAndUpdate(order.userId, { cartData: {} });

//       // Send confirmation emails
//       if (user) {
//         await sendOrderConfirmationEmail(order, user);
//       }

//       console.log(`Payment successful for order ${orderId}, transaction ${txnid}`);

//       // Redirect to success page
//       const successUrl = `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}&txnid=${txnid}&status=success&amount=${amount}`;
//       console.log("Redirecting to:", successUrl);
//       return res.redirect(successUrl);

//     } else {
//       // Payment failed
//       await orderModel.findByIdAndUpdate(orderId, {
//         paymentStatus: 'failed',
//         status: 'cancelled',
//         transactionId: txnid,
//         paymentResponse: verificationData,
//         hashVerified: hashValid,
//         updatedAt: Date.now()
//       });

//       // Send failure email
//       if (user) {
//         await sendPaymentFailedEmail(order, user, error_Message || status);
//       }

//       const failUrl = `${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&status=${status}&error=${encodeURIComponent(error_Message || 'Payment failed')}`;
//       console.log("Redirecting to failure page:", failUrl);
//       return res.redirect(failUrl);
//     }

//   } catch (error) {
//     console.error('PayU Verification Error:', error);
    
//     // Log detailed error
//     console.error('Error details:', {
//       message: error.message,
//       stack: error.stack,
//       body: req.body
//     });

//     // Send error email to admin
//     try {
//       const errorMailOptions = {
//         from: process.env.EMAIL_FROM,
//         to: process.env.ADMIN_EMAIL,
//         subject: 'PayU Verification Error',
//         html: `
//           <h3>PayU Verification Error</h3>
//           <p><strong>Error:</strong> ${error.message}</p>
//           <p><strong>Time:</strong> ${new Date().toISOString()}</p>
//           <p><strong>Request Body:</strong></p>
//           <pre>${JSON.stringify(req.body, null, 2)}</pre>
//           <p><strong>Stack Trace:</strong></p>
//           <pre>${error.stack}</pre>
//         `
//       };
//       await transporter.sendMail(errorMailOptions);
//     } catch (emailError) {
//       console.error('Failed to send error email:', emailError);
//     }

//     const errorUrl = `${process.env.FRONTEND_URL}/order-error?error=${encodeURIComponent(error.message)}`;
//     return res.redirect(errorUrl);
//   }
// };

// Send payment failed email

const verifyPayUPayment = async (req, res) => {
  try {
    console.log("PayU Verification Headers:", req.headers['content-type']);
    console.log("PayU Verification Body (raw):", req.body);

    let verificationData = req.body;

    // Extract ALL fields
    const {
      txnid,
      status,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      mihpayid,
      email,
      firstname,
      productinfo,
      amount,
      key,
      error,
      error_Message,
      bankcode,
      bank_ref_num,
      net_amount_debit,
      mode,
      PG_TYPE,
      payment_source
    } = verificationData;

    console.log("Extracted verification data:", {
      txnid,
      status,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      mihpayid,
      email,
      firstname,
      productinfo,
      amount,
      key
    });

    const orderId = udf1;

    if (!orderId) {
      throw new Error('Order ID not found in verification data');
    }

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new Error('Order not found with ID: ' + orderId);
    }

    // Get user details
    const user = await User.findById(order.userId);

    // CORRECT HASH VERIFICATION FOR PAYU RESPONSE
    const verifyString = 
      `${PAYU_CONFIG.salt}|` +
      `${status}|` +
      `|||||` +  // 5 empty fields after status
      `${udf5 || ''}|` +
      `${udf4 || ''}|` +
      `${udf3 || ''}|` +
      `${udf2 || ''}|` +
      `${udf1 || ''}|` +
      `${email}|` +
      `${firstname}|` +
      `${productinfo}|` +
      `${amount}|` +
      `${txnid}|` +
      `${key}`;

    console.log("Verify string for hash generation:", verifyString);

    // Generate hash in lowercase
    const generatedHash = crypto
      .createHash("sha512")
      .update(verifyString)
      .digest("hex")
      .toLowerCase();

    console.log("Generated hash:", generatedHash);
    console.log("Received hash:", hash ? hash.toLowerCase() : 'No hash received');

    let hashValid = false;
    
    // Compare hashes (both in lowercase for consistency)
    if (hash && generatedHash === hash.toLowerCase()) {
      hashValid = true;
      console.log("Hash verification SUCCESSFUL");
    } else {
      console.warn("Hash verification FAILED");
      
      // In test mode, we might accept if status is success
      if (PAYU_CONFIG.testMode && status === 'success') {
        console.warn("Proceeding with payment despite hash mismatch (TEST MODE)");
        hashValid = true;
      }
    }

    if (!hashValid) {
      console.error('Hash verification failed and status not success');
      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: 'hash_failed',
        status: 'failed',
        transactionId: txnid,
        paymentResponse: {
          hashMismatch: true,
          generatedHash: generatedHash,
          receivedHash: hash
        },
        updatedAt: Date.now()
      });

      return res.redirect(`${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&reason=hash_mismatch&status=${status}`);
    }

    // Handle successful payment
    if (status === 'success') {
      // Payment successful
      const updateData = {
        payment: true,
        paymentStatus: 'paid',
        status: 'processing',
        transactionId: txnid,
        paymentId: mihpayid,
        netAmountDebit: net_amount_debit,
        bankCode: bankcode,
        bankRefNum: bank_ref_num,
        paymentResponse: verificationData,
        updatedAt: Date.now(),
        hashVerified: hashValid,
        Shipping: order.Shipping || 0 // Ensure Shipping field is preserved
      };

      console.log("Updating order with data:", updateData);

      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });

      // Clear user's cart - यहाँ IMPORTANT है
      await User.findByIdAndUpdate(order.userId, { cartData: {} });

      // Shiprocket में order create करें
      try {
        await createShiprocketOrder(updatedOrder, user);
        console.log("Shiprocket order created successfully for order:", orderId);
      } catch (shiprocketError) {
        console.error("Shiprocket order creation failed:", shiprocketError);
        // Log error but don't fail the payment
      }

      // Send confirmation emails
      if (user) {
        await sendOrderConfirmationEmail(order, user);
      }

      console.log(`Payment successful for order ${orderId}, transaction ${txnid}`);

      // Redirect to success page
      const successUrl = `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}&txnid=${txnid}&status=success&amount=${amount}`;
      console.log("Redirecting to:", successUrl);
      return res.redirect(successUrl);

    } else {
      // Payment failed
      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
        status: 'cancelled',
        transactionId: txnid,
        paymentResponse: verificationData,
        hashVerified: hashValid,
        updatedAt: Date.now()
      });

      // Send failure email
      if (user) {
        await sendPaymentFailedEmail(order, user, error_Message || status);
      }

      const failUrl = `${process.env.FRONTEND_URL}/order-failed?orderId=${orderId}&status=${status}&error=${encodeURIComponent(error_Message || 'Payment failed')}`;
      console.log("Redirecting to failure page:", failUrl);
      return res.redirect(failUrl);
    }

  } catch (error) {
    console.error('PayU Verification Error:', error);
    
    // Log detailed error
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    // Send error email to admin
    try {
      const errorMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: 'PayU Verification Error',
        html: `
          <h3>PayU Verification Error</h3>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Request Body:</strong></p>
          <pre>${JSON.stringify(req.body, null, 2)}</pre>
          <p><strong>Stack Trace:</strong></p>
          <pre>${error.stack}</pre>
        `
      };
      await transporter.sendMail(errorMailOptions);
    } catch (emailError) {
      console.error('Failed to send error email:', emailError);
    }

    const errorUrl = `${process.env.FRONTEND_URL}/order-error?error=${encodeURIComponent(error.message)}`;
    return res.redirect(errorUrl);
  }
};

// Shiprocket Order Creation Function
const createShiprocketOrder = async (order, user) => {
  try {
    // 1. Authenticate with Shiprocket
    const authRes = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      {
        email: "niranjan13ishnavi@gmail.com", // Replace with your Shiprocket email
        password: "d!MAD!7gGn0x*BL9" // Replace with your Shiprocket password
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const shiprocketToken = authRes.data.token;

    // 2. Format date for Shiprocket
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    const orderDate = formatDate(order.date);

    // 3. Prepare shipping order payload
    const orderPayload = {
      order_id: order._id.toString(),
      order_date: orderDate,
      pickup_location: "home-2", // Your pickup location
      comment: "",
      billing_customer_name: order.address.firstName,
      billing_last_name: order.address.lastName,
      billing_address: order.address.street,
      billing_address_2: "Near Hokage House", // Adjust as needed
      billing_city: order.address.city,
      billing_pincode: order.address.zipcode,
      billing_state: order.address.state,
      billing_country: order.address.country,
      billing_email: order.address.email || user.email,
      billing_phone: order.address.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item._id,
        units: item.quantity,
        selling_price: item.discountedprice,
        hsn: 441122 // Update with actual HSN codes
      })),
      payment_method: "prepaid", // For online payments
      shipping_charges: order.Shipping || 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: order.amount.toFixed(2),
      length: 8,
      breadth: 8,
      height: 3.5,
      weight: 0.2
    };

    console.log("Shiprocket Order Payload:", orderPayload);

    // 4. Create Shiprocket Order
    const shipRes = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${shiprocketToken}`
        }
      }
    );

    console.log("Shiprocket Response:", shipRes.data);

    // Save Shiprocket shipment ID to order
    if (shipRes.data.shipment_id) {
      await orderModel.findByIdAndUpdate(order._id, {
        shipmentId: shipRes.data.shipment_id,
        shiprocketOrderId: shipRes.data.order_id
      });
    }

    return shipRes.data;

  } catch (error) {
    console.error('Shiprocket Order Creation Error:', error.response?.data || error.message);
    throw error;
  }
};

const sendPaymentFailedEmail = async (order, user, errorMessage) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Payment Failed - Order #${order._id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f44336;">Payment Failed</h2>
          <p>Dear ${order.address.firstName},</p>
          <p>We couldn't process your payment for Order #${order._id.toString().slice(-8)}.</p>
          <div style="background: #fff3f3; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
            <p><strong>Error:</strong> ${errorMessage || 'Payment not completed'}</p>
            <p><strong>Amount:</strong> ₹${order.amount.toFixed(2)}</p>
            <p><strong>Order ID:</strong> ${order._id.toString().slice(-8)}</p>
          </div>
          <p>You can try again from your order history or choose a different payment method.</p>
          <p>Thank you,<br>Your Store Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send payment failed email:', error);
  }
};

// Send order confirmation email for PayU
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    // Format date
    const orderDate = new Date(order.date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });

    // Calculate total savings
    const totalSavings = order.items.reduce((sum, item) => {
      return sum + (item.actualprice - item.discountedprice) * item.quantity;
    }, 0);

    // Generate items HTML
    const itemsHTML = order.items.map(item => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 15px 0; text-align: center;">
          ${item.image ?
        (item.type === 'combo' ?
          `<img src="${process.env.BACKEND_URL}/uploads/thumbImg/${item.image}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">` :
          (Array.isArray(item.image) ?
            `<img src="${process.env.BACKEND_URL}${item.image[0]?.url || item.image[0]}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">` :
            `<img src="${process.env.BACKEND_URL}${item.image}" alt="${item.name}" width="80" style="border-radius: 4px; border: 1px solid #eee;">`
          )
        )
        :
        '<div style="width: 80px; height: 80px; background: #f5f5f5; display: inline-block; border-radius: 4px;"></div>'}
        </td>
        <td style="padding: 15px 0;">
          <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
          ${item.size ? `<div style="color: #666; font-size: 13px; margin-bottom: 5px;">Size: ${item.size}</div>` : ''}
          <div style="color: #666; font-size: 13px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 15px 0; text-align: right;">
          <div style="font-weight: 600;">₹${item.discountedprice * item.quantity}</div>
          ${item.actualprice > item.discountedprice ?
        `<div style="color: #666; font-size: 13px; text-decoration: line-through;">₹${item.actualprice * item.quantity}</div>` : ''}
        </td>
      </tr>
    `).join('');

    // Customer email template
    const customerMailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation #${order._id.toString().slice(-8)} (PayU)`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Order Confirmation</title>
          <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e0e0e0; }
              .logo { max-width: 150px; }
              .thank-you { font-size: 24px; color: #2e7d32; margin: 20px 0; }
              .order-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-weight: bold; }
              .section-title { font-size: 18px; margin: 25px 0 15px 0; color: #2e7d32; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
              .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .info-table td { padding: 8px 0; vertical-align: top; }
              .items-table { width: 100%; border-collapse: collapse; }
              .total-row { font-weight: bold; font-size: 16px; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px; }
          </style>
      </head>
      <body>
          <div class="header">
              <img src="https://yourstore.com/logo.png" alt="Your Store Logo" class="logo">
          </div>
          
          <div class="thank-you">Thank you for your purchase, ${order.address.firstName}!</div>
          <p>Your order has been confirmed and payment was successful via PayU.</p>
          
          <div class="section-title">Order Summary</div>
          <table class="info-table">
              <tr>
                  <td>Order ID:</td>
                  <td>${order._id.toString().slice(-8)}</td>
              </tr>
              <tr>
                  <td>Transaction ID:</td>
                  <td>${order.transactionId || ''}</td>
              </tr>
              <tr>
                  <td>Amount Paid:</td>
                  <td>₹${order.amount.toFixed(2)}</td>
              </tr>
              <tr>
                  <td>Payment Method:</td>
                  <td>PayU Money</td>
              </tr>
              <tr>
                  <td>Payment Status:</td>
                  <td>Paid</td>
              </tr>
              <tr>
                  <td>Order Date:</td>
                  <td>${orderDate}</td>
              </tr>
              ${totalSavings > 0 ? `
              <tr>
                  <td>Total Savings:</td>
                  <td style="color: #2e7d32;">₹${totalSavings.toFixed(2)}</td>
              </tr>` : ''}
          </table>
          
          <div class="section-title">Shipping Details</div>
          <table class="info-table">
              <tr>
                  <td colspan="2">
                      ${order.address.firstName} ${order.address.lastName}<br>
                      ${order.address.street}<br>
                      ${order.address.city}, ${order.address.state}<br>
                      ${order.address.country} - ${order.address.zipcode}<br>
                      Phone: ${order.address.phone}
                  </td>
              </tr>
          </table>
          
          <div class="section-title">Items Ordered</div>
          <table class="items-table">
              <thead>
                  <tr style="border-bottom: 2px solid #e0e0e0;">
                      <th style="text-align: left; padding-bottom: 10px; width: 100px;">Image</th>
                      <th style="text-align: left; padding-bottom: 10px;">Item</th>
                      <th style="text-align: right; padding-bottom: 10px;">Price</th>
                  </tr>
              </thead>
              <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                      <td colspan="2" style="padding-top: 15px; text-align: right;">Total:</td>
                      <td style="padding-top: 15px; text-align: right;">₹${order.amount.toFixed(2)}</td>
                  </tr>
              </tbody>
          </table>
          
          <p style="margin-top: 25px;">We've received your order and will process it shortly. You'll receive another email when your items ship.</p>
          
          <div class="footer">
              <p>If you have any questions, please contact us at support@yourstore.com</p>
              <p>© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          </div>
      </body>
      </html>
      `
    };

    // Admin notification email
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New PayU Order #${order._id.toString().slice(-8)} - ₹${order.amount.toFixed(2)}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">New PayU Order Received</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Transaction ID:</strong> ${order.transactionId}</p>
          <p><strong>Customer:</strong> ${order.address.firstName} ${order.address.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> ₹${order.amount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> PayU Money</p>
          <p><strong>Items:</strong> ${order.items.length} items</p>
          <p><strong>Shipping to:</strong> ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}</p>
          <p><strong>Contact:</strong> ${order.address.phone}</p>
          <p style="margin-top: 20px;"><a href="https://yourstore.com/admin/orders/${order._id}" style="background: #2e7d32; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">View Order in Dashboard</a></p>
      </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
};
const payUWebhook = async (req, res) => {
  try {
    const { txnid, status, hash, additionalCharges, net_amount_debit, mihpayid } = req.body;

    // Verify hash
    const verifyString = `${PAYU_CONFIG.salt}|${status}|||||||||||${mihpayid}|${txnid}||${PAYU_CONFIG.key}`;
    const generatedHash = crypto.createHash('sha512').update(verifyString).toString('hex');

    if (hash !== generatedHash) {
      console.error('Webhook hash mismatch');
      return res.status(400).json({ success: false, message: 'Invalid hash' });
    }

    // Find order by transaction ID
    const order = await orderModel.findOne({ transactionId: txnid });
    if (!order) {
      console.error('Order not found for transaction:', txnid);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status === 'success') {
      await orderModel.findByIdAndUpdate(order._id, {
        payment: true,
        paymentStatus: 'paid',
        mihpayid: mihpayid,
        netAmountDebit: net_amount_debit,
        additionalCharges: additionalCharges,
        updatedAt: Date.now()
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};




//all order data for admin panel

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Users Order for frontend

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Update Order Stauts  for admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// orders tracking api
const trackOrders = async (req, res) => {
  const { shipmentId } = req.params;
  try {
    const shiprocketResponse = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track?shipment_id=${shipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
        },
      }
    );
    if (shiprocketResponse.data.status === 200) {
      const trackingUrl = shiprocketResponse.data.tracking_data.track_url;
      res.json({ success: true, trackingUrl });
    } else {
      res.json({ success: false, message: "Tracking information unavailable" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error tracking order" });
  }
};



const ShipOrders = async (req, res) => {
  try {
    const { orderData, orderid } = req.body;



    const authRes = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      {
        email: "niranjan13ishnavi@gmail.com",
        password: "d!MAD!7gGn0x*BL9"
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const shiprokettoken = authRes.data.token;


    console.log(shiprokettoken);

    // 2. Prepare shipping order payload

    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    const currentDate = Date.now();
    var currentDatetime = formatDate(currentDate)
    // Get the current timestamp

    console.log(orderData)

    const orderPayload = {
      order_id: orderid, // Order ID   
      order_date: currentDatetime, // Current datetime in "yyyy-mm-dd hh:mm" format
      pickup_location: "home-2", // Static pickup location
      comment: "",
      billing_customer_name: orderData.address.firstName, // Billing first name from order data
      billing_last_name: orderData.address.lastName, // Billing last name from order data
      billing_address: orderData.address.street, // Billing address from order data
      billing_address_2: "Near Hokage House", // Static second billing address
      billing_city: orderData.address.city, // Billing city from order data
      billing_pincode: orderData.address.zipcode, // Billing pincode from order data
      billing_state: orderData.address.state, // Billing state from order data
      billing_country: orderData.address.country, // Billing country from order data
      billing_email: orderData.address.email, // Billing email from order data
      billing_phone: orderData.address.phone, // Billing phone from order data
      shipping_is_billing: true, // Assuming shipping is the same as billing
      order_items: orderData.items.map(item => ({
        name: item.name, // Item name from order data
        sku: item._id, // SKU from order data
        units: item.quantity, // Item quantity from order data
        selling_price: item.discountedprice, // Discounted price from order data
        hsn: 441122 // Static HSN code (could be dynamic based on your needs)
      })),
      payment_method: orderData.paymentMethod === "razorpay" ? "prepaid" : "postpaid",  // Payment method from order data
      shipping_charges: 0, // Assuming no shipping charges
      giftwrap_charges: 0, // Assuming no giftwrap charges
      transaction_charges: 0, // Assuming no transaction charges
      total_discount: 0, // Assuming no discount
      sub_total: orderData.amount.toFixed(2), // Subtotal from order data
      length: 8, // Static length (you can update based on actual data)
      breadth: 8, // Static breadth (you can update based on actual data)
      height: 3.5, // Static height (you can update based on actual data)
      weight: 0.2 // Static weight (you can update based on actual data)
    };
    console.log(orderPayload)

    // 3. Create Shiprocket Order
    const shipRes = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${shiprokettoken}`
        }
      }
    );

    console.log("Shiprocket Response:", shipRes.data.orderData);


    res.json({ success: true, message: "Order Ship Successfully" });


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  ShipOrders,
  getOrderPublic,
  generateInvoice,
  initiatePayUPayment, verifyPayUPayment, payUWebhook
};
