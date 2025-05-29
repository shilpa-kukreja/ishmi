import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUpload, FaSpinner } from "react-icons/fa";

const backendUrl = "http://localhost:5000";

const Add = ({ token }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    Shortdescription: "",
    mainCategory: "",
    subCategory: "",
    bestseller: false,
  });

  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });



  const [loading, setLoading] = useState(false);
  const descriptionEditorRef = useRef(null);
  const shortDescriptionEditorRef = useRef(null);

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
          Shortdescription: shortDescriptionEditorRef.current.getData(),
        }));
      });
    }

    return () => {
      if (descriptionEditorRef.current) descriptionEditorRef.current.destroy();
      if (shortDescriptionEditorRef.current) shortDescriptionEditorRef.current.destroy();
    };
  }, []);


  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/${id}`);
        if (response.data.success) {
          const product = response.data.product;
          setFormData({
            name: product.name || "",
            description: product.description || "",
            Shortdescription: product.Shortdescription || "",
            mainCategory: product.category.mainCategory || "",
            subCategory: product.category.subCategory || "",
            bestseller: product.bestseller || false,
          });

          const imageArray = product.image || [];
          setImages({
            image1: imageArray[0] || null,
            image2: imageArray[1] || null,
            image3: imageArray[2] || null,
            image4: imageArray[3] || null,
          });
          setSizes(product.sizes || []);

          // Set CKEditor content
          setTimeout(() => {
            if (descriptionEditorRef.current) {
              descriptionEditorRef.current.setData(product.description || "");
            }
            if (shortDescriptionEditorRef.current) {
              shortDescriptionEditorRef.current.setData(product.Shortdescription || "");
            }
          }, 200);
        } else {
          toast.error("❌ Failed to load product.");
        }
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching product.");
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  };

  const addSize = () => {
    setSizes((prev) => [
      ...prev,
      { size: "", actualprice: "", discountedprice: "", offer: "" },
    ]);
  };

  const handleFileChange = (e) => {
    setImages((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
     
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      data.append("sizes", JSON.stringify(sizes));

      Object.entries(images).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });
    
      let response;
      if (id) {
      
        response = await axios.post(`${backendUrl}/api/product/update/${id}`, data, {
          headers: { token, "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new product
        response = await axios.post(`${backendUrl}/api/product/add`, data, {
          headers: { token, "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(`✅ Product ${id ? "updated" : "added"} successfully`);
        if (!id) {
          setFormData({
            name: "",
            description: "",
            Shortdescription: "",
            mainCategory: "",
            subCategory: "",
            bestseller: false,
          });
          setSizes([]);
          setImages({ image1: null, image2: null, image3: null, image4: null });
        }
      } else {
        toast.error("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("❌ Failed to submit product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white shadow rounded-lg ">
      <h2 className="text-xl font-bold mb-4">{id ? "Edit" : "Add"} Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border text-sm border-gray-300 rounded"
          required
        />
            <p
  className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
  >Description</p>
        <textarea
          id="description-editor"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full hidden text-sm"
        />
       <p
  className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
  >ShortDescription</p>

        <textarea
          id="short-description-editor"
          name="Shortdescription"
          value={formData.Shortdescription}
          onChange={handleChange}
          className="w-full hidden text-sm"
        />

        <div className="grid grid-cols-2 mt-2 gap-4">
          <input
            type="text"
            name="mainCategory"
            placeholder="Main Category"
            value={formData.mainCategory}
            onChange={handleChange}
            className="p-2 border text-sm border-gray-300 rounded"
            
          />
          <input
            type="text"
            name="subCategory"
            placeholder="Sub Category"
            value={formData.subCategory}
            onChange={handleChange}
            className="p-2 text-sm border border-gray-300 rounded"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleChange}
          />
          <label>Bestseller</label>
        </div>

        <h3 className="font-semibold">Product Sizes</h3>
        {sizes.map((item, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {["size", "actualprice", "discountedprice", "offer"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={item[field]}
                onChange={(e) =>
                  handleSizeChange(i, field, e.target.value)
                }
                className="p-2 border text-sm border-gray-300 rounded"
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="text-blue-500 text-sm underline"
        >
          + Add Size
        </button>

        <div className="grid grid-cols-2 gap-4">
        {["image1", "image2", "image3", "image4"].map((imgKey) => (
  <div key={imgKey}>
    <label className="block text-sm font-medium capitalize">{imgKey}</label>

    {/* Preview the image if it exists */}
    {images[imgKey] && typeof images[imgKey] === "string" && (
      <img
        src={images[imgKey]}
        alt="Preview"
        className="w-24 h-24 object-cover text-sm mb-2 border"
      />
    )}

    <input
      type="file"
      name={imgKey}
      onChange={handleFileChange}
      className="mt-1"
    />
  </div>
))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-sm text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? (
            <span className="flex text-sm items-center gap-2">
              <FaSpinner className="animate-spin" /> Submitting...
            </span>
          ) : id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
