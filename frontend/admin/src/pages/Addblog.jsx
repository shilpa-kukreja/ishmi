import React, { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRef } from "react";
import { useEffect } from "react";

const Addblog = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

   const descriptionEditorRef = useRef(null);

    useEffect(() => {
       // Initialize editors after component mounts
       if (window.CKEDITOR) {
         descriptionEditorRef.current = window.CKEDITOR.replace('description-editor', {
           toolbar: [
             { name: 'document', items: ['Source'] },
             { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
             { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Blockquote'] },
             { name: 'links', items: ['Link', 'Unlink'] },
             { name: 'insert', items: ['Image', 'Table'] },
             { name: 'styles', items: ['Styles', 'Format'] },
             { name: 'tools', items: ['Maximize'] }
           ],
           height: 200
         });
        

           // Set change handlers
      descriptionEditorRef.current.on('change', () => {
        setFormData(prev => ({
          ...prev,
          description: descriptionEditorRef.current.getData()
        }));
      });
    }
      return () => {
        // Clean up editors when component unmounts
        if (descriptionEditorRef.current) {
          descriptionEditorRef.current.destroy();
        }
       
      };
    }, []);
    
  

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:5000/api/blog/add", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      setFormData({ name: "", description: "", image: null });
    } catch (error) {
      console.error(error);
      alert("Error adding blog");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="w-full  bg-white p-10 rounded-lg shadow-xl">
        <h1 className="text-xl font-bold text-gray-800 text-center mb-6">
          Create a New Blog
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center">
            <label htmlFor="image" className="cursor-pointer flex flex-col items-center">
              {formData.image ? (
                <img
                  className="w-40 h-40 rounded-lg object-cover border-2 border-gray-300 shadow-md"
                  src={URL.createObjectURL(formData.image)}
                  alt="Upload Preview"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center rounded-lg bg-gray-200 border-2 border-dashed border-gray-300 shadow-md">
                  <FaCloudUploadAlt className="text-gray-500 text-5xl" />
                </div>
              )}
            </label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} hidden />
            <p className="text-gray-600 text-xs mt-2">Click to upload an image</p>
          </div>

          {/* Blog Name */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Blog Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the blog name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description-editor"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Write a brief description of the blog"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-base shadow-lg hover:bg-blue-700 transition-all"
          >
            Add Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addblog;