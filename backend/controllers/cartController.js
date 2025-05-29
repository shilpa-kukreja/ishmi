
import User from "../models/User.js";
// Add product to cart controller
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await User.findById(userId);

    // if (!userData) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found" });
    // }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = { sizes: {} };
    }

    if (cartData[itemId].sizes[size]) {
      cartData[itemId].sizes[size] += 1;
    } else {
      cartData[itemId].sizes[size] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await User.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = { sizes: {} };
    }

    if (quantity > 0) {
      cartData[itemId].sizes[size] = {
        quantity,
        discountedprice: cartData[itemId].sizes[size]?.discountedprice || 0,
        actualprice: cartData[itemId].sizes[size]?.actualprice || 0,
      };
    } else {
      delete cartData[itemId].sizes[size];

      if (Object.keys(cartData[itemId].sizes).length === 0) {
        delete cartData[itemId];
      }
    }

    await User.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Cart Updated", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };