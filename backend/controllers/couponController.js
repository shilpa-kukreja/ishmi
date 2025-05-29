
import CouponModel from "../models/CouponModel.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    console.log("Received coupon code:", code);
    console.log("Received totalAmount:", totalAmount);

    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount received",
      });
    }

    // Find the coupon
    const coupon = await CouponModel.findOne({ code, isActive: true });

    if (!coupon) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid coupon code" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }

    if (totalAmount < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount is ₹${coupon.minPurchaseAmount}`,
      });
    }

    let discount = coupon.discount; // Fixed amount discount
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    // Calculate new total after discount
    const newTotalAmount = Math.max(totalAmount - discount, 0);

    console.log("Calculated discount:", discount);
    console.log("New total amount:", newTotalAmount);

    return res.status(200).json({
      success: true,
      discount: discount,
      newTotalAmount,
    });
  } catch (error) {
    console.error("Error in applyCoupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const addCoupan=async (req, res) => {
  try {
    const { code, discount, expiryDate, minPurchaseAmount, maxDiscountAmount, isActive } = req.body;

    const existing = await CouponModel.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await CouponModel.create({
      code,
      discount,
      expiryDate,
      minPurchaseAmount,
      maxDiscountAmount,
      isActive,
    });

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    res.status(200).json({ coupons });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle coupon status
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`, coupon });
  } catch (err) {
    console.error('Error toggling status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
