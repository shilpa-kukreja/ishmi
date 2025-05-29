import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loginnavigate, setLoginnavigate] = useState('/');
  const currency = "₹";
  const delivery_fee = 0;
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const [wishlist, setWishlist] = useState(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

 const addToWishlist = (item, type = "product") => {
  setWishlist((prevWishlist) => {
    // Check if item already exists in wishlist
    if(type === "combo") {
       const isItemInWishlist = prevWishlist.some(
      (wishlistItem) => wishlistItem._id === item._id && wishlistItem.type === "combo"
    );
    if (isItemInWishlist) {
      toast.info(
        `${type === "combo" ? "Combo" : "Product"} is already in your wishlist`
      );
      return prevWishlist;
   }
    }else{
    const isItemInWishlist = prevWishlist.some(
      (wishlistItem) => wishlistItem._id === item._id && wishlistItem.type === "product"
    );
    if (isItemInWishlist) {
      toast.info(
        `${type === "combo" ? "Combo" : "Product"} is already in your wishlist`
      );
      return prevWishlist;
   }
  }
   

    // Add item with type information
    const itemToAdd = {
      ...item,
      type: type // 'product' or 'combo'
    };

    toast.success(
      `${type === "combo" ? "Combo" : "Product"} added to wishlist!`
    );
    return [...prevWishlist, itemToAdd];
  });
};


  

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item._id !== productId)
    );
  };

  const getWishlistCount = () => wishlist.length;

 const addToCart = async (product, type = "product") => {
  // For combos, we don't need size selection
  if (type === "combo") {
    const { _id, name, thumbImg, actualprice, discountedprice } = product;

    let cartData = structuredClone(cartItems);

    if (!cartData[_id]) {
      cartData[_id] = {
        name,
        image: thumbImg,
        type: "combo",
        quantity: 0,
        price: discountedprice || actualprice,
        actualprice,
        discountedprice
      };
    }

    // Increment quantity
    cartData[_id].quantity += 1;

    setCartItems(cartData);
 toast.success("Added to cart Successfully!");
    if (token) {
      try {
        await axios.post(
          "http://localhost:5000/api/cart/add",
          { 
            itemId: _id,
            type: "combo",
            quantity: cartData[_id].quantity
          },
          { headers: { token } }
        );
        // toast.success("Added to cart Successfully!");
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add combo to cart");
      }
    }
    return;
  }

  // Original product handling (with sizes)
  if (!product.sizes || product.sizes.length === 0) {
    toast.error("This product has no available sizes");
    return;
  }

  // Rest of your original product handling code...
  const { _id, name, image, sizes } = product;

  // For products, use the first size if none selected
  const selectedSize = sizes[0].size;

  let cartData = structuredClone(cartItems);

  if (!cartData[_id]) {
    cartData[_id] = {
      name,
      image,
      sizes: {},
    };
  }

  if (!cartData[_id].sizes[selectedSize]) {
    cartData[_id].sizes[selectedSize] = {
      quantity: 0,
      discountedprice: sizes[0].discountedprice,
      actualprice: sizes[0].actualprice,
    };
  }

  cartData[_id].sizes[selectedSize].quantity += 1;

  setCartItems(cartData);
  toast.success("Added to cart Successfully!");
  if (token) {
    try {
      
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { itemId: _id, size: selectedSize },
        { headers: { token } }
      );
      // toast.success("Added to cart Successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product to cart");
    }
  }
};

  const getCartCount = () => {
  return Object.values(cartItems).reduce((total, item) => {
    // Handle combos (which don't have sizes)
    if (item.type === "combo") {
      return total + Number(item.quantity || 0);
    }
    
    // Handle products with sizes
    if (item.sizes) {
      return total + 
        Object.values(item.sizes).reduce(
          (sum, sizeDetails) => sum + Number(sizeDetails.quantity || 0),
          0
        );
    }
    
    return total;
  }, 0);
};

  const updateQuantity = async (productId, size, quantity, type = "product") => {
  let cartData = structuredClone(cartItems);

  if (type === "combo") {
    if (quantity === 0) {
      delete cartData[productId];
    } else {
      if (!cartData[productId]) {
        // This shouldn't happen as we should have the combo data already
        return;
      }
      cartData[productId].quantity = quantity;
    }
  } else {
    // Original product handling
    if (quantity === 0) {
      delete cartData[productId].sizes[size];
      // If no sizes left, remove the product entirely
      if (Object.keys(cartData[productId].sizes).length === 0) {
        delete cartData[productId];
      }
    } else {
      cartData[productId].sizes[size].quantity = quantity;
    }
  }

  setCartItems(cartData);

  if (token) {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/update",
        {
          itemId: productId,
          size: type === "product" ? size : undefined,
          quantity,
          type
        },
        { headers: { token } }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  }
};
 const getCartAmount = () => {
  return Object.values(cartItems).reduce((totalAmount, item) => {
    // Handle combos (which don't have sizes)
    if (item.type === "combo") {
      return totalAmount + 
        (Number(item.discountedprice || 0) * 
         Number(item.quantity || 0));
    }
    
    // Handle products with sizes
    if (item.sizes) {
      return totalAmount + 
        Object.values(item.sizes).reduce(
          (sum, sizeDetails) => 
            sum + 
            (Number(sizeDetails.discountedprice || 0) * 
             Number(sizeDetails.quantity || 0)),
          0
        );
    }
    
    return totalAmount;
  }, 0);
};
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/get",
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  
  const getProductsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/product/list"
      );
      if (response.data.success) {
        setProducts(response.data.products);
        console.log("response" , response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);



   const fetchCombos = async () => {
     
      try {
        const res = await axios.get('http://localhost:5000/api/combos/list');
        setCombos(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch combos');
      } 
    }
  useEffect(()=>{
    fetchCombos();
  },[])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blog/get");
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  const value = {
    products,
    combos,
    blogs,
    addToCart,
    getCartAmount,
    updateQuantity,
    getCartCount,
    currency,
    cartItems,
    setCartItems,
    navigate,
    delivery_fee,
    addToWishlist,
    removeFromWishlist,
    getWishlistCount,
    wishlist,
    token,
    setToken,
    getProductsData,
    loginnavigate,
    setLoginnavigate,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;