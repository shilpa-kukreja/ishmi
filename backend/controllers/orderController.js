import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import User from "../models/User.js";
import nodemailer from 'nodemailer';

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

    const { userId, items, amount, address, couponCode, discount } = req.body;
    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "No items provided in the order",
      });
    }

    console.log("Items to Save:", items);
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      couponCode,
      discount,
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
          <p>Your order has been confirmed and will be processed shortly. Please pay <strong>₹${newOrder.amount}</strong> when your order is delivered.</p>
          
          <div class="section-title">Order Summary</div>
          <table class="info-table">
              <tr>
                  <td>Order ID:</td>
                  <td>${newOrder._id.toString().slice(-8)}</td>
              </tr>
              <tr>
                  <td>Amount to Pay:</td>
                  <td>₹${newOrder.amount}</td>
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
                  <td style="color: #2e7d32;">₹${totalSavings}</td>
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
                      <td style="padding-top: 15px; text-align: right;">₹${newOrder.amount}</td>
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
      subject: `New COD Order #${newOrder._id.toString().slice(-8)} - ₹${newOrder.amount}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">New COD Order Received</h2>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Customer:</strong> ${newOrder.address.firstName} ${newOrder.address.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> ₹${newOrder.amount}</p>
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

    res.json({ success: true, message: "Order Placed" });
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
    const { userId, items, amount, address, couponCode, discount } = req.body;
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
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: (amount) * 100,
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
                    <td>₹${order.amount}</td>
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
                    <td style="color: #2e7d32;">₹${totalSavings}</td>
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
                        <td style="padding-top: 15px; text-align: right;">₹${order.amount}</td>
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
        subject: `New Order #${order._id.toString().slice(-8)} - ₹${order.amount}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">New Order Received</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Customer:</strong> ${order.address.firstName} ${order.address.lastName} (${order.address.email})</p>
            <p><strong>Amount:</strong> ₹${order.amount}</p>
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

export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
