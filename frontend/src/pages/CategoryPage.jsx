import React, { useContext, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("subcategory"); // Extract subcategory from query params

  const navigate = useNavigate();
  const { products, addToCart } = useContext(ShopContext);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const normalizedCategoryName = categoryName?.toLowerCase().replace(/\s+/g, '');
   
  // const mainCategory = products.category.mainCategory;
  const categoryBanners = {
    bodycare: assets.TOPBANNER4,       
    haircare: assets.hair,
    chocolate: assets.TOPBANNER2,       
  
    default: assets.TOPBANNER2, 

  };
  const bannerImage = categoryBanners[normalizedCategoryName] || categoryBanners.default;















  // Extract unique categories
  const categories = [
    ...new Set(products.map((product) => product.category.mainCategory)),
  ];

  // Extract unique subcategories based on selected category
  const subcategories = [
    ...new Set(
      products
        .filter((product) => product.category.mainCategory === selectedCategory)
        .map((product) => {
          return typeof product.category.subCategory === "string"
            ? product.category.subCategory
            : product.category.subCategory?.name || "";
        })
        .filter(Boolean)
    ),
  ];

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    // console.log("Filtered Products:", product);
    const productSubcategory =
      typeof product.category.subCategory === "object"
        ? product.category.subCategory?.name
        : product.category.subCategory;

    return (
      product.category.mainCategory === categoryName &&
      (!subcategory || productSubcategory === subcategory)
    );
  });

  // Handle Category Click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    navigate(`/category/${category}`);
  };

  // Handle Subcategory Click
  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    navigate(`/category/${selectedCategory}?subcategory=${subcategory}`);
  };

  return (
    <div className=" mx-auto pb-10 bg-[#FEF0E1]">
      <img
        className="w-full max-h-[450px] mb-8 object-cover shadow-lg"
        src={bannerImage}
         alt={`${categoryName} Banner`}
      />
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 capitalize">
          {categoryName || "Shop By Category"}
        </h2>
        <p className="text-gray-500 mt-2">
          Discover top picks in various categories
        </p>
      </div>

      {/* Shop By - Category List */}
      <div className="flex flex-wrap  gap-3 justify-center my-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full border-2 ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            } transition`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Subcategory Filter */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center my-4">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              className={`px-4 py-2 rounded-full border-2 ${
                selectedSubcategory === subcategory
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black hover:bg-gray-100"
              } transition`}
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      {/* Product Listing */}
      <div className="grid grid-cols-2 px-5 sm:px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 mt-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden "
            >
              <div className="relative w-full  overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.image[0].url}`}
                    alt={product.name}
                    className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                  />
                  {product.offer && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {product.offer}% OFF
                    </span>
                  )}
                </Link>
              </div>

              <div className="p-3 text-center">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                {/* <p className="text-sm text-gray-500">
                  {product.category.mainCategory} -{" "}
                  {typeof product.category.subCategory === "object"
                    ? product.category.subCategory?.name
                      ? String(product.category.subCategory.name)
                      : "N/A"
                    : typeof product.category.subCategory === "string"
                    ? product.category.subCategory
                    : "N/A"}
                </p> */}

                {/* Star Rating */}
                {/* <div className="flex justify-center gap-1 my-2">
                  {Array(4)
                    .fill("")
                    .map((_, i) => (
                      <img
                        key={i}
                        className="w-5"
                        src="https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000"
                        alt="Star"
                      />
                    ))}
                  <img
                    className="w-5"
                    src="https://img.icons8.com/?size=100&id=tKTHzO8F7kZi&format=png&color=000000"
                    alt="Half Star"
                  />
                </div> */}

                {/* Pricing */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    ₹{product.sizes[0].discountedprice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.sizes[0].actualprice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    const selectedSize = product.sizes[0];
                    // toast.success(`${product.name} added to cart!`);
                    addToCart(product, selectedSize);
                  }}
                  className="mt-2 w-full   bg-[#8f6943] hover:bg-[#a78767] text-white py-2 cursor-pointer rounded-md font-medium transition"
                  >
                    Add to Cart
                  </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
