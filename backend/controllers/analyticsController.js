// controllers/analyticsController.js
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const getAnalytics = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    // Current date and date calculations
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    let dateFilter = {};
    switch (period) {
      case "today":
        dateFilter = { date: { $gte: startOfDay } };
        break;
      case "weekly":
        dateFilter = { date: { $gte: startOfWeek } };
        break;
      case "monthly":
        dateFilter = { date: { $gte: startOfMonth } };
        break;
      case "yearly":
        dateFilter = { date: { $gte: startOfYear } };
        break;
    }

    // Get all orders for the period
    const orders = await orderModel.find(dateFilter);

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = await productModel.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate revenue growth
    const previousPeriod = new Date();
    switch (period) {
      case "today":
        previousPeriod.setDate(previousPeriod.getDate() - 1);
        break;
      case "weekly":
        previousPeriod.setDate(previousPeriod.getDate() - 7);
        break;
      case "monthly":
        previousPeriod.setMonth(previousPeriod.getMonth() - 1);
        break;
      case "yearly":
        previousPeriod.setFullYear(previousPeriod.getFullYear() - 1);
        break;
    }

    const previousOrders = await orderModel.find({ date: { $gte: previousPeriod } });
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : 100;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // Calculate conversion rate (assuming all users who visited)
    const usersWithOrders = await User.countDocuments({ 
      _id: { $in: orders.map(order => order.userId).filter(id => id) }
    });
    const conversionRate = totalUsers > 0 
      ? ((usersWithOrders / totalUsers) * 100).toFixed(1)
      : 0;

    // Get recent orders
    const recentOrders = await orderModel.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('userId', 'email');

    // Get top selling products
    const allOrders = await orderModel.find();
    const productSales = {};
    
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item._id]) {
          productSales[item._id] = {
            id: item._id,
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item._id].quantity += item.quantity;
        productSales[item._id].revenue += item.discountedprice * item.quantity;
      });
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get order status distribution
    const statusDistribution = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get revenue by payment method
    const revenueByPaymentMethod = await orderModel.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          totalRevenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get daily revenue for chart (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const dailyRevenue = await orderModel.aggregate([
      {
        $match: {
          date: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get monthly revenue for chart (last 6 months)
    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);
    
    const monthlyRevenue = await orderModel.aggregate([
      {
        $match: {
          date: { $gte: last6Months }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" }
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Calculate visitor statistics (simulated - you would integrate with actual analytics)
    const visitorsData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 500) + 300,
        pageViews: Math.floor(Math.random() * 2000) + 1500
      };
    });

    // Return all analytics data
    res.json({
      success: true,
      analytics: {
        summary: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalUsers,
          averageOrderValue,
          conversionRate,
          revenueGrowth: parseFloat(revenueGrowth)
        },
        charts: {
          dailyRevenue,
          monthlyRevenue,
          visitors: visitorsData,
          statusDistribution,
          revenueByPaymentMethod
        },
        topSellingProducts,
        recentOrders,
        period
      }
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
      error: error.message
    });
  }
};

export { getAnalytics };