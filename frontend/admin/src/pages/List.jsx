import { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaImage, FaEdit } from "react-icons/fa";
// Added FaEdit

const backendUrl = "https://ishmiherbal.com";

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // Remove a product
  const removeProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.post(`${backendUrl}/api/product/remove`, {
          id,
        });
        if (response.data.success) {
          toast.success("Product removed successfully!");
          fetchProducts();
        } else {
          toast.error("Failed to remove product.");
        }
      } catch (error) {
        console.error("Error removing product:", error);
        toast.error("Failed to remove product.");
      }
    }
  };

  // Update a product (demo: update name)
  const handleUpdate = async (product) => {
    const newName = prompt("Enter new product name:", product.name);
    if (!newName || newName === product.name) return;

    try {
      const response = await axios.put(`${backendUrl}/api/product/update`, {
        id: product._id,
        updatedData: { name: newName },
      });

      if (response.data.success) {
        toast.success("Product updated successfully!");
        fetchProducts();
      } else {
        toast.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className=" mx-auto bg-white p-8 rounded-2xl shadow-2xl mt-5">
      <h2 className="text-xl font-extrabold text-gray-500 mb-8 text-center tracking-wide">
        Product List
      </h2>

      {loading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex items-center space-x-6 bg-gray-100 p-5 rounded-lg shadow-md"
            >
              <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-12 bg-gray-300 rounded w-28"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl p-6 transition-all"
            >
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                {product.image && product.image[0] ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.image[0].url}`}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FaImage className="text-xl text-gray-400" />
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 px-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {product.category?.mainCategory || "No Main Category"} /
                  {product.category?.subCategory || "No Sub Category"}
                </p>
                <span className="text-sm font-bold text-blue-600 mt-2 block">
                  ₹{product.sizes[0]?.actualprice || "N/A"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/add/${product._id}`)}
                  className="bg-yellow-400 text-sm text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition-all flex items-center shadow-md hover:shadow-lg"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => removeProduct(product._id)}
                  className="bg-red-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center shadow-md hover:shadow-lg"
                >
                  <FaTrash className="mr-2" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
