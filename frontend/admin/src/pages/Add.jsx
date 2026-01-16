// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FaUpload, FaSpinner } from "react-icons/fa";

// const backendUrl = "https://ishmiherbal.com";

// const Add = ({ atoken }) => {
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     Shortdescription: "",
//     AdditionalInformation:"",
//     mainCategory: "",
//     subCategory: "",
//     bestseller: false,
//   });

//   const [sizes, setSizes] = useState([]);
//   const [images, setImages] = useState({
//     image1: null,
//     image2: null,
//     image3: null,
//     image4: null,
//   });



//   const [loading, setLoading] = useState(false);
//   const descriptionEditorRef = useRef(null);
//   const shortDescriptionEditorRef = useRef(null);
//   const additionalInformationEditorRef = useRef(null);

//   useEffect(() => {
//     if (window.CKEDITOR) {
//       descriptionEditorRef.current = window.CKEDITOR.replace("description-editor");
//       shortDescriptionEditorRef.current = window.CKEDITOR.replace("short-description-editor");
//       additionalInformationEditorRef.current = window.CKEDITOR.replace("additional-information-editor");



//       descriptionEditorRef.current.on("change", () => {
//         setFormData((prev) => ({
//           ...prev,
//           description: descriptionEditorRef.current.getData(),
//         }));
//       });

//       shortDescriptionEditorRef.current.on("change", () => {
//         setFormData((prev) => ({
//           ...prev,
//           Shortdescription: shortDescriptionEditorRef.current.getData(),
//         }));
//       });
//     }

//     additionalInformationEditorRef.current.on("change",()=>{
//       setFormData((prev) => ({
//         ...prev,
//         AdditionalInformation: additionalInformationEditorRef.current.getData(),
//         }));
//     });

//     return () => {
//       if (descriptionEditorRef.current) descriptionEditorRef.current.destroy();
//       if (shortDescriptionEditorRef.current) shortDescriptionEditorRef.current.destroy();
//       if (additionalInformationEditorRef.current) additionalInformationEditorRef.current.destroy();
//     };
//   }, []);



//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/api/product/${id}`);
//         if (response.data.success) {
//           const product = response.data.product;
//           setFormData({
//             name: product.name || "",
//             description: product.description || "",
//             Shortdescription: product.Shortdescription || "",
//             AdditionalInformation: product.AdditionalInformation || "",
//             mainCategory: product.category.mainCategory || "",
//             subCategory: product.category.subCategory || "",
//             bestseller: product.bestseller || false,
//           });

//           const imageArray = product.image || [];
//           setImages({
//             image1: imageArray[0] || null,
//             image2: imageArray[1] || null,
//             image3: imageArray[2] || null,
//             image4: imageArray[3] || null,
//           });
//           setSizes(product.sizes || []);

//           // Set CKEditor content
//           setTimeout(() => {
//             if (descriptionEditorRef.current) {
//               descriptionEditorRef.current.setData(product.description || "");
//             }
//             if (shortDescriptionEditorRef.current) {
//               shortDescriptionEditorRef.current.setData(product.Shortdescription || "");
//             }
//             if (additionalInformationEditorRef.current) {
//               additionalInformationEditorRef.current.setData(product.AdditionalInformation || "");
//               }
//           }, 200);
//         } else {
//           toast.error("❌ Failed to load product.");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("❌ Error fetching product.");
//       }
//     };

//     if (id) {
//       fetchProductDetails();
//     }
//   }, [id]);


//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSizeChange = (index, field, value) => {
//     const updated = [...sizes];
//     updated[index][field] = value;
//     setSizes(updated);
//   };

//   const addSize = () => {
//     setSizes((prev) => [
//       ...prev,
//       { size: "", actualprice: "", discountedprice: "", offer: "" },
//     ]);
//   };

//   const handleFileChange = (e) => {
//     setImages((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.files[0],
//     }));
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const data = new FormData();

//     // Append all form data
//     Object.entries(formData).forEach(([key, value]) => {
//       data.append(key, value);
//     });

//     // Handle sizes
//     if (sizes && sizes.length > 0) {
//       data.append("sizes", JSON.stringify(sizes));
//     }

//     // Handle images - we'll collect all images (both existing URLs and new files)
//     const imageArray = [];

    
//     // Process each image field
//     for (const [key, file] of Object.entries(images)) {
//       if (file instanceof File) {
//         // It's a new file upload
//         data.append(key, file);
      
//       } else if (file) {
//         // It's an existing URL (string)
//         imageArray.push(file);
//       }
//     }

  
//     const config = {
//       headers: { 
//         atoken, 
//         "Content-Type": "multipart/form-data" 
//       },
//     };

//     const endpoint = id 
//       ? `${backendUrl}/api/product/update/${id}`
//       : `${backendUrl}/api/product/add`;

//     const response = await axios.post(endpoint, data, config);

//     if (response.data.success) {
//       toast.success(`✅ Product ${id ? "updated" : "added"} successfully`);
//       if (!id) {
//         // Reset form for new products
//         setFormData({
//           name: "",
//           description: "",
//           Shortdescription: "",
//            AdditionalInformation:"",
//           mainCategory: "",
//           subCategory: "",
//           bestseller: false,
//         });
//         setSizes([]);
//         setImages({ image1: null, image2: null, image3: null, image4: null });
        
//         // Clear CKEditor content
//         if (descriptionEditorRef.current) {
//           descriptionEditorRef.current.setData("");
//         }
//         if (shortDescriptionEditorRef.current) {
//           shortDescriptionEditorRef.current.setData("");
//         }
//         if(additionalInformationEditorRef.current){
//           additionalInformationEditorRef.current.setData("");
//         }
//       }
//     } else {
//       toast.error("❌ " + (response.data.message || "Operation failed"));
//     }
//   } catch (error) {
//     console.error("Error submitting:", error);
//     toast.error(`❌ ${error.response?.data?.message || "Failed to submit product."}`);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="mx-auto p-6 bg-white shadow rounded-lg ">
//       <h2 className="text-xl font-bold mb-4">{id ? "Edit" : "Add"} Product</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <input
//           type="text"
//           name="name"
//           placeholder="Product name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 border text-sm border-gray-300 rounded"
//           required
//         />
//         <p
//           className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
//         >Description</p>
//         <textarea
//           id="description-editor"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full hidden text-sm"
//         />
//         <p
//           className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
//         >ShortDescription</p>

//         <textarea
//           id="short-description-editor"
//           name="Shortdescription"
//           value={formData.Shortdescription}
//           onChange={handleChange}
//           className="w-full hidden text-sm"
//         />

//          <p
//           className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
//         >Additional Info</p>

//         <textarea
//           id="additional-information-editor"
//           name="AdditionalInformation"
//           value={formData.AdditionalInformation}
//           onChange={handleChange}
//           className="w-full hidden text-sm"
//         />

//         <div className="grid grid-cols-2 mt-2 gap-4">
//           <input
//             type="text"
//             name="mainCategory"
//             placeholder="Main Category"
//             value={formData.mainCategory}
//             onChange={handleChange}
//             className="p-2 border text-sm border-gray-300 rounded"

//           />
//           <input
//             type="text"
//             name="subCategory"
//             placeholder="Sub Category"
//             value={formData.subCategory}
//             onChange={handleChange}
//             className="p-2 text-sm border border-gray-300 rounded"

//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="bestseller"
//             checked={formData.bestseller}
//             onChange={handleChange}
//           />
//           <label>Bestseller</label>
//         </div>

//         <h3 className="font-semibold">Product Sizes</h3>
//         {sizes.map((item, i) => (
//           <div key={i} className="grid grid-cols-4 gap-2">
//             {["size", "actualprice", "discountedprice", "offer"].map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 placeholder={field}
//                 value={item[field]}
//                 onChange={(e) =>
//                   handleSizeChange(i, field, e.target.value)
//                 }
//                 className="p-2 border text-sm border-gray-300 rounded"
//               />
//             ))}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addSize}
//           className="text-blue-500 text-sm underline"
//         >
//           + Add Size
//         </button>

//         <div className="grid grid-cols-2 gap-4">
//           {["image1", "image2", "image3", "image4"].map((imgKey) => (
//             <div key={imgKey}>
//               <label className="block text-sm font-medium capitalize">{imgKey}</label>

//               {/* Preview the image if it exists */}
//               {images[imgKey] && typeof images[imgKey] === "string" && (
//                 <img
//                   src={images[imgKey]}
//                   alt="Preview"

//                   className="w-24 h-24 object-cover text-sm mb-2 border"
//                 />
//               )}
             

//               <input
//                 type="file"
//                 name={imgKey}
//                 onChange={handleFileChange}
//                 className="mt-1"
//               />
//             </div>
//           ))}
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-sm text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? (
//             <span className="flex text-sm items-center gap-2">
//               <FaSpinner className="animate-spin" /> Submitting...
//             </span>
//           ) : id ? "Update Product" : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Add;



import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUpload, FaSpinner, FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const backendUrl = "https://ishmiherbal.com";

const Add = ({ atoken }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    Shortdescription: "",
    AdditionalInformation: "",
    mainCategory: "",
    subCategory: "",
    bestseller: false,
  });

  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState({
    image1: { file: null, preview: "", existing: null },
    image2: { file: null, preview: "", existing: null },
    image3: { file: null, preview: "", existing: null },
    image4: { file: null, preview: "", existing: null },
  });

  const [loading, setLoading] = useState(false);
  const descriptionEditorRef = useRef(null);
  const shortDescriptionEditorRef = useRef(null);
  const additionalInformationEditorRef = useRef(null);

  // Initialize CKEditor
  useEffect(() => {
    if (window.CKEDITOR) {
      descriptionEditorRef.current = window.CKEDITOR.replace("description-editor");
      shortDescriptionEditorRef.current = window.CKEDITOR.replace("short-description-editor");
      additionalInformationEditorRef.current = window.CKEDITOR.replace("additional-information-editor");

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

      additionalInformationEditorRef.current.on("change", () => {
        setFormData((prev) => ({
          ...prev,
          AdditionalInformation: additionalInformationEditorRef.current.getData(),
        }));
      });
    }

    return () => {
      if (descriptionEditorRef.current) descriptionEditorRef.current.destroy();
      if (shortDescriptionEditorRef.current) shortDescriptionEditorRef.current.destroy();
      if (additionalInformationEditorRef.current) additionalInformationEditorRef.current.destroy();
    };
  }, []);

  // Fetch product details for editing
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/${id}`);
        if (response.data.success) {
          const product = response.data.product;
          
          // Set form data
          setFormData({
            name: product.name || "",
            description: product.description || "",
            Shortdescription: product.Shortdescription || "",
            AdditionalInformation: product.AdditionalInformation || "",
            mainCategory: product.category?.mainCategory || "",
            subCategory: product.category?.subCategory || "",
            bestseller: product.bestseller || false,
          });

          // Set sizes
          setSizes(product.sizes || []);

          // Handle images - set existing image URLs
          const imageArray = product.image || [];
          const updatedImages = { ...images };
          
          ["image1", "image2", "image3", "image4"].forEach((key, index) => {
            if (imageArray[index]) {
              updatedImages[key] = {
                file: null,
                preview: "",
                existing: `${backendUrl}${imageArray[index].url}`
              };
            } else {
              updatedImages[key] = {
                file: null,
                preview: "",
                existing: null
              };
            }
          });
          
          setImages(updatedImages);

          // Set CKEditor content with delay to ensure editors are ready
          setTimeout(() => {
            if (descriptionEditorRef.current) {
              descriptionEditorRef.current.setData(product.description || "");
            }
            if (shortDescriptionEditorRef.current) {
              shortDescriptionEditorRef.current.setData(product.Shortdescription || "");
            }
            if (additionalInformationEditorRef.current) {
              additionalInformationEditorRef.current.setData(product.AdditionalInformation || "");
            }
          }, 500);
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
    
    // Auto-calculate offer percentage if actualprice and discountedprice are provided
    if ((field === "actualprice" || field === "discountedprice") && 
        updated[index].actualprice && updated[index].discountedprice) {
      const actual = parseFloat(updated[index].actualprice);
      const discounted = parseFloat(updated[index].discountedprice);
      if (actual > 0 && discounted > 0) {
        const offerPercent = Math.round(((actual - discounted) / actual) * 100);
        updated[index].offer = offerPercent.toString();
      }
    }
    
    setSizes(updated);
  };

  const addSize = () => {
    setSizes((prev) => [
      ...prev,
      { size: "", actualprice: "", discountedprice: "", offer: "" },
    ]);
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("❌ Please select an image file.");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("❌ Image size should be less than 5MB.");
        return;
      }
      
      const preview = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [key]: {
          file: file,
          preview: preview,
          existing: null // Clear existing image when new file is selected
        }
      }));
    }
  };

  const removeImage = (key) => {
    setImages(prev => ({
      ...prev,
      [key]: {
        file: null,
        preview: "",
        existing: null
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'bestseller') {
          data.append(key, value);
        }
      });
      
      // Append bestseller as string
      data.append("bestseller", formData.bestseller.toString());

      // Handle sizes
      if (sizes && sizes.length > 0) {
        data.append("sizes", JSON.stringify(sizes));
      }

      // Handle images
      let hasNewImages = false;
      for (const [key, imageData] of Object.entries(images)) {
        if (imageData.file) {
          // New file selected
          data.append(key, imageData.file);
          hasNewImages = true;
        } else if (imageData.existing && !hasNewImages) {
          // Keep existing image if no new file was selected
          // We need to handle this on the backend
          // For now, we'll append a flag to indicate we want to keep existing images
          data.append(`keep${key}`, "true");
        }
      }

      const config = {
        headers: { 
          atoken, 
          "Content-Type": "multipart/form-data" 
        },
      };

      const endpoint = id 
        ? `${backendUrl}/api/product/update/${id}`
        : `${backendUrl}/api/product/add`;

      const response = await axios.post(endpoint, data, config);

      if (response.data.success) {
        toast.success(`✅ Product ${id ? "updated" : "added"} successfully`);
        
        if (!id) {
          // Reset form for new products
          setFormData({
            name: "",
            description: "",
            Shortdescription: "",
            AdditionalInformation: "",
            mainCategory: "",
            subCategory: "",
            bestseller: false,
          });
          setSizes([]);
          setImages({
            image1: { file: null, preview: "", existing: null },
            image2: { file: null, preview: "", existing: null },
            image3: { file: null, preview: "", existing: null },
            image4: { file: null, preview: "", existing: null },
          });
          
          // Clear CKEditor content
          if (descriptionEditorRef.current) {
            descriptionEditorRef.current.setData("");
          }
          if (shortDescriptionEditorRef.current) {
            shortDescriptionEditorRef.current.setData("");
          }
          if(additionalInformationEditorRef.current){
            additionalInformationEditorRef.current.setData("");
          }
          
          // Clear all preview URLs
          Object.values(images).forEach(img => {
            if (img.preview) {
              URL.revokeObjectURL(img.preview);
            }
          });
        } else {
          // For updates, clear file selections but keep existing image previews
          const updatedImages = { ...images };
          Object.keys(updatedImages).forEach(key => {
            if (updatedImages[key].preview) {
              URL.revokeObjectURL(updatedImages[key].preview);
            }
            if (updatedImages[key].file) {
              updatedImages[key] = {
                file: null,
                preview: "",
                existing: updatedImages[key].existing
              };
            }
          });
          setImages(updatedImages);
        }
      } else {
        toast.error("❌ " + (response.data.message || "Operation failed"));
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(`❌ ${error.response?.data?.message || "Failed to submit product."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow rounded-lg">
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
        
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium mb-2">Description</p>
          <textarea
            id="description-editor"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full hidden text-sm"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium mb-2">Short Description</p>
          <textarea
            id="short-description-editor"
            name="Shortdescription"
            value={formData.Shortdescription}
            onChange={handleChange}
            className="w-full hidden text-sm"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium mb-2">Additional Information</p>
          <textarea
            id="additional-information-editor"
            name="AdditionalInformation"
            value={formData.AdditionalInformation}
            onChange={handleChange}
            className="w-full hidden text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            id="bestseller"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="bestseller" className="text-sm font-medium">Bestseller</label>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Product Sizes</h3>
          {sizes.length > 0 && (
            <div className="mb-3 p-3 bg-gray-50 rounded">
              {sizes.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Size"
                    value={item.size}
                    onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                    className="p-2 border text-sm border-gray-300 rounded col-span-3"
                  />
                  <input
                    type="number"
                    placeholder="Actual Price"
                    value={item.actualprice}
                    onChange={(e) => handleSizeChange(i, "actualprice", e.target.value)}
                    className="p-2 border text-sm border-gray-300 rounded col-span-3"
                  />
                  <input
                    type="number"
                    placeholder="Discounted Price"
                    value={item.discountedprice}
                    onChange={(e) => handleSizeChange(i, "discountedprice", e.target.value)}
                    className="p-2 border text-sm border-gray-300 rounded col-span-3"
                  />
                  <input
                    type="text"
                    placeholder="Offer %"
                    value={item.offer}
                    onChange={(e) => handleSizeChange(i, "offer", e.target.value)}
                    className="p-2 border text-sm border-gray-300 rounded col-span-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(i)}
                    className="text-red-500 hover:text-red-700 col-span-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addSize}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <FaUpload /> Add Size
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {["image1", "image2", "image3", "image4"].map((imgKey) => (
            <div key={imgKey} className="space-y-2">
              <label className="block text-sm font-medium capitalize mb-2">
                {imgKey.replace('image', 'Image ')}
              </label>
              
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex flex-col items-center justify-center">
                {/* Image Preview */}
                {images[imgKey]?.existing ? (
                  <div className="relative w-full h-full">
                    <img
                      src={images[imgKey].existing}
                      alt="Existing Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Existing
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(imgKey)}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        title="Remove Image"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                ) : images[imgKey]?.preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={images[imgKey].preview}
                      alt="New Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(imgKey)}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        title="Remove Image"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaUpload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-500">Click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                
                {/* File Input - hidden but triggerable */}
                <input
                  type="file"
                  id={imgKey}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, imgKey)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              {/* Status Indicator */}
              <div className="flex justify-between items-center text-xs">
                <span className={images[imgKey]?.existing ? "text-green-600" : images[imgKey]?.preview ? "text-blue-600" : "text-gray-500"}>
                  {images[imgKey]?.existing ? "✓ Image exists" : 
                   images[imgKey]?.preview ? "✓ New image selected" : 
                   "No image selected"}
                </span>
                {(images[imgKey]?.existing || images[imgKey]?.preview) && (
                  <button
                    type="button"
                    onClick={() => removeImage(imgKey)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> 
              {id ? "Updating..." : "Adding..."}
            </span>
          ) : (
            id ? "Update Product" : "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default Add;
