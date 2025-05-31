import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

const AddCombo = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    products: [],
    slug: "",
    sku: "",
    stock: "",
    actualprice: 0,
    discountedprice: 0,
  });

  const [thumbImg, setThumbImg] = useState(null);
  const [thumbImgPreview, setThumbImgPreview] = useState("");
  const [galleryImgs, setGalleryImgs] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const descriptionEditorRef = useRef(null);
  const shortDescriptionEditorRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchProductDetails();
    }
    },[id]);

    // Initialize CKEditor after products are loaded
  useEffect(() => {
        if (window.CKEDITOR) {
            descriptionEditorRef.current = window.CKEDITOR.replace("description-editor");
            shortDescriptionEditorRef.current = window.CKEDITOR.replace("short-description-editor");

            descriptionEditorRef.current.on("change", () => {
                setFormData((prev) => ({
                    ...prev,
                    description: descriptionEditorRef.current.getData(),
                }));
            });

            shortDescriptionEditorRef.current.on("change", () => {
                setFormData((prev) => ({
                    ...prev,
                    shortDescription: shortDescriptionEditorRef.current.getData(),
                }));
            });
        }

        return () => {
            if (descriptionEditorRef.current) descriptionEditorRef.current.destroy();
            if (shortDescriptionEditorRef.current) shortDescriptionEditorRef.current.destroy();
        };
    }, [isEditMode]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://ishmiherbal.com/api/combos/${id}`);
      if (response.data.success) {
        const combo = response.data.combo || response.data;

        setFormData({
          name: combo.name || "",
          slug: combo.slug || "",
          shortDescription: combo.shortDescription || "",
          description: combo.description || "",
          products: combo.products || [],
          sku: combo.sku || "",
          stock: combo.stock || "",
          actualprice: combo.actualprice || 0,
          discountedprice: combo.discountedprice || 0,
        });

        if (combo.thumbImg) {
          setThumbImgPreview(`https://ishmiherbal.com/uploads/thumbimg/${combo.thumbImg}`);
        }

        if (combo.galleryImg?.length > 0) {
          const galleryUrls = combo.galleryImg.map(img =>
            typeof img === 'string' ? `https://ishmiherbal.com/uploads/galleryImg/${img}` : img
          );
          setGalleryPreviews(galleryUrls);
        }

        // Set CKEditor content after a small delay to ensure editors are initialized
        setTimeout(() => {
          if (descriptionEditorRef.current && combo.description) {
            descriptionEditorRef.current.setData(combo.description);
          }
          if (shortDescriptionEditorRef.current && combo.shortDescription) {
            shortDescriptionEditorRef.current.setData(combo.shortDescription);
          }
        }, 1000);
      } else {
        toast.error("❌ Failed to load combo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error fetching combo.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (selectedProducts = []) => {
    try {
      const res = await axios.get("https://ishmiherbal.com/api/product/list");
      setProducts(res.data.products);
      
      // If selectedProducts are provided (for edit mode), ensure they're in the options
      if (selectedProducts.length > 0) {
        setFormData(prev => ({
          ...prev,
          products: selectedProducts.filter(productId => 
            res.data.products.some(p => p._id === productId)
          )
        }));
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      toast.error("Failed to load Products");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const generateSlug = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")    // Remove special characters
        .replace(/\s+/g, "-")            // Replace spaces with hyphens
        .replace(/-+/g, "-");            // Remove multiple hyphens

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "name") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleThumbImgChange = (e) => {
    if (e.target.files[0]) {
      setThumbImg(e.target.files[0]);
      setThumbImgPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const handleChangeproducts = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, products: selectedIds }));
  };

  const removeProduct = (idToRemove) => {
    const updated = formData.products.filter((id) => id !== idToRemove);
    setFormData((prev) => ({ ...prev, products: updated }));
  };

  const clearAll = () => {
    setFormData((prev) => ({ ...prev, products: [] }));
  };

  const handleGalleryImgsChange = (e) => {
    if (e.target.files.length > 0) {
      const newGalleryImgs = Array.from(e.target.files);
      setGalleryImgs([...galleryImgs, ...newGalleryImgs]);

      const newPreviews = newGalleryImgs.map(file => URL.createObjectURL(file));
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImg = (index) => {
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);

    const newGalleryImgs = [...galleryImgs];
    newGalleryImgs.splice(index, 1);
    setGalleryImgs(newGalleryImgs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          payload.append(key, JSON.stringify(value));
        } else {
          payload.append(key, value);
        }
      });

      // Append images
      if (thumbImg) payload.append("thumbImg", thumbImg);
      galleryImgs.forEach((img) => payload.append("galleryImg", img));

      let response;
      if (isEditMode) {
        response = await axios.put(
          `https://ishmiherbal.com/api/combos/update/${id}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          "https://ishmiherbal.com/api/combos/add",
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
       console.log(response);
      if (response.data.success) {
        toast.success(`🎉 Combo ${isEditMode ? 'updated' : 'added'} successfully!`);
       
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
        `Failed to ${isEditMode ? 'update' : 'add'} combo. Please check your inputs and try again.`
      );
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} combo:`, error);
      toast.error(`❌ Failed to ${isEditMode ? 'update' : 'add'} combo`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Combo' : 'Add New Combo'}
      </h2>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Descriptions</h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                id="short-description-editor"
                name="shortDescription"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
              <textarea
                id="description-editor"
                name="description"
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>

          {/* Badges */}
          {formData.products.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.products.map((productId) => {
                const product = products.find((p) => p._id === productId);
                return product ? (
                  <span
                    key={productId}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                  >
                    {product.name}
                    <button
                      type="button"
                      onClick={() => removeProduct(productId)}
                      className="ml-2 text-indigo-600 hover:text-indigo-900"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Multi-select Dropdown */}
          <Select
            isMulti
            name="products"
            options={productOptions}
            placeholder="Click to select products..."
            value={productOptions.filter((opt) =>
              formData.products.includes(opt.value)
            )}
            onChange={handleChangeproducts}
            className="react-select-container"
            classNamePrefix="select"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.375rem",
                borderColor: "#D1D5DB",
                padding: "4px",
                boxShadow: "none",
                "&:hover": { borderColor: "#6366F1" },
              }),
            }}
          />

          {formData.products.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 text-sm text-indigo-600 hover:underline"
            >
              Clear All
            </button>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {formData.products.length > 0
              ? `${formData.products.length} selected`
              : "Click to select one or more products"}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Actual Price ($)</label>
              <input
                type="number"
                name="actualprice"
                value={formData.actualprice}
                min="0"
                step="0.01"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Discount Price ($)</label>
              <input
                type="number"
                name="discountedprice"
                value={formData.discountedprice}
                min="0"
                step="0.01"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              min="0"
              onChange={handleChange}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Combo Images</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
              <div className="flex flex-col items-center space-y-4">
                {thumbImgPreview ? (
                  <div className="relative group">
                    <img
                      src={thumbImgPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-contain rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbImg(null);
                        setThumbImgPreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-indigo-500 transition-colors">
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbImgChange}
                      className="hidden"
                      required={!isEditMode}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500">Main combo image (required, 1:1 ratio recommended)</p>
            </div>

            {/* Gallery Images Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-indigo-500 transition-colors">
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span className="text-sm text-gray-600">
                    {galleryPreviews.length > 0
                      ? `Add more images (${galleryPreviews.length} selected)`
                      : "Click to upload gallery images"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImgsChange}
                    className="hidden"
                  />
                </label>

                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryPreviews.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImg(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Additional combo images (optional)</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isEditMode ? 'Update Combo' : 'Add Combo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCombo;