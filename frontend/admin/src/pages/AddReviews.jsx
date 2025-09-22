// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AddReviews = () => {
//   const [form, setForm] = useState({
//     name: "",
//     rating: 0,
//     comment: "",
//     productId: "",
//   });

//   const [reviews, setReviews] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [productLoading, setProductLoading] = useState(false);
//   const [msg, setMsg] = useState({ text: "", type: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [hoverRating, setHoverRating] = useState(0);

//   // Fetch all products
//   const fetchProducts = async () => {
//     setProductLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/product/list`);
//       if (response.data.success) {
//         setProducts(response.data.products);
//       } else {
//         setMsg({ text: "Failed to fetch products", type: "error" });
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setMsg({ text: "Failed to fetch products", type: "error" });
//     } finally {
//       setProductLoading(false);
//     }
//   };


//     const fetchCombos = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:5000/api/combos/list`);
//       setCombos(res.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to fetch combos');
//     } finally {
//       setLoading(false);
//     }
//   };




//   // Fetch reviews for a product
//   const fetchReviews = async () => {
//     if (!form.productId) return;
//     try {
//       setLoading(true);
//       const res = await fetch(`http://localhost:5000/api/reviews/product/${form.productId}`);
//       const data = await res.json();
//       if (data.success) setReviews(data.reviews);
//     } catch (err) {
//       console.error(err);
//       setMsg({ text: "Failed to fetch reviews", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (form.productId) {
//       fetchReviews();
//     }
//   }, [form.productId]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleProductChange = (e) => {
//     const productId = e.target.value;
//     setForm({ ...form, productId });
//   };

//   const handleRatingClick = (rating) => {
//     setForm({ ...form, rating });
//   };

//   const handleRatingHover = (rating) => {
//     setHoverRating(rating);
//   };

//   const handleRatingLeave = () => {
//     setHoverRating(0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMsg({ text: "", type: "" });

//     // Validation
//     if (!form.name || !form.rating || !form.comment || !form.productId) {
//       setMsg({ text: "Please fill all fields", type: "error" });
//       setLoading(false);
//       return;
//     }

//     try {
//       const url = editingId
//         ? `http://localhost:5000/api/reviews/${editingId}`
//         : "http://localhost:5000/api/reviews/add";

//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (data.success) {
//         setMsg({ 
//           text: editingId ? "Review updated successfully!" : "Review added successfully!", 
//           type: "success" 
//         });
//         setForm({ name: "", rating: 0, comment: "", productId: form.productId });
//         setEditingId(null);
//         fetchReviews();
//       } else {
//         setMsg({ text: data.message, type: "error" });
//       }
//     } catch (error) {
//       setMsg({ text: error.message, type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (review) => {
//     setForm({
//       name: review.name,
//       rating: review.rating,
//       comment: review.comment,
//       productId: review.product,
//     });
//     setEditingId(review._id);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this review?")) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/reviews/${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) {
//         setMsg({ text: "Review deleted successfully", type: "success" });
//         fetchReviews();
//       } else {
//         setMsg({ text: data.message, type: "error" });
//       }
//     } catch (err) {
//       console.error(err);
//       setMsg({ text: "Failed to delete review", type: "error" });
//     }
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedReviews = [...reviews].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     setReviews(sortedReviews);
//   };

//   const RatingStars = ({ rating, interactive = false, onRate, onHover, onLeave }) => {
//     const displayRating = interactive ? (hoverRating || rating) : rating;
    
//     return (
//       <div className="flex items-center">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type={interactive ? "button" : "div"}
//             onClick={interactive ? () => onRate(star) : null}
//             onMouseEnter={interactive ? () => onHover(star) : null}
//             onMouseLeave={interactive ? onLeave : null}
//             className={`p-1 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
//           >
//             <svg
//               className={`w-6 h-6 ${star <= displayRating ? 'text-yellow-400' : 'text-gray-300'}`}
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//           </button>
//         ))}
//         {!interactive && <span className="ml-2 text-sm text-gray-600">({rating})</span>}
//       </div>
//     );
//   };

//   const getProductName = (productId) => {
//     const product = products.find(p => p._id === productId);
//     return product ? product.name : "Unknown Product";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Review Management System
//           </h1>
//           <p className="text-gray-600 mt-2">Add and manage product reviews with ease</p>
//         </div>

//         {/* Form */}
//         <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//               </svg>
//               {editingId ? "Update Review" : "Add New Review"}
//             </h2>
//             {editingId && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingId(null);
//                   setForm({ name: "", rating: 0, comment: "", productId: form.productId });
//                 }}
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center"
//               >
//                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                 </svg>
//                 Cancel Edit
//               </button>
//             )}
//           </div>
          
//           {msg.text && (
//             <div className={`mb-6 p-4 rounded-xl ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
//               <div className="flex items-center">
//                 {msg.type === "success" ? (
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                   </svg>
//                 ) : (
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                   </svg>
//                 )}
//                 {msg.text}
//               </div>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InputField 
//               label="Your Name" 
//               name="name" 
//               value={form.name} 
//               onChange={handleChange} 
//               type="text" 
//               placeholder="Enter your name"
//               icon={
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                 </svg>
//               }
//             />
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <RatingStars 
//                   rating={form.rating} 
//                   interactive={true}
//                   onRate={handleRatingClick}
//                   onHover={handleRatingHover}
//                   onLeave={handleRatingLeave}
//                 />
//                 <div className="mt-2 text-sm text-gray-500">
//                   {form.rating > 0 ? `Selected: ${form.rating} star${form.rating > 1 ? 's' : ''}` : 'Click to rate'}
//                 </div>
//               </div>
//             </div>
            
//             <div className="md:col-span-2">
//               <TextareaField 
//                 label="Your Review" 
//                 name="comment" 
//                 value={form.comment} 
//                 onChange={handleChange} 
//                 placeholder="Share your detailed experience with this product"
//                 icon={
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
//                   </svg>
//                 }
//               />
//             </div>
            
//             <div className="md:col-span-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
//                 <div className="relative">
//                   <select
//                     name="productId"
//                     value={form.productId}
//                     onChange={handleProductChange}
//                     className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
//                     required
//                   >
//                     <option value="">Choose a product to review</option>
//                     {products.map((product) => (
//                       <option key={product._id} value={product._id}>
//                         {product.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
//                     </svg>
//                   </div>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="md:col-span-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                     </svg>
//                     {editingId ? "Update Review" : "Submit Review"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Reviews Table */}
//         {form.productId && (
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
//                   </svg>
//                   Product Reviews
//                 </h3>
//                 <p className="text-gray-600 text-sm">Showing reviews for: <span className="font-medium text-indigo-600">{getProductName(form.productId)}</span></p>
//               </div>
              
//               <div className="flex space-x-2 mt-4 md:mt-0">
//                 <button 
//                   onClick={fetchReviews}
//                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center"
//                 >
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
//                   </svg>
//                   Refresh
//                 </button>
                
//                 <div className="relative">
//                   <select 
//                     className="pl-3 pr-8 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium appearance-none"
//                     onChange={(e) => handleSort(e.target.value)}
//                     value={sortConfig.key}
//                   >
//                     <option value="">Sort by</option>
//                     <option value="name">Name</option>
//                     <option value="rating">Rating</option>
//                     <option value="createdAt">Date</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               </div>
//             ) : reviews.length > 0 ? (
//               <div className="overflow-x-auto rounded-xl border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th 
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                         onClick={() => handleSort('name')}
//                       >
//                         <div className="flex items-center">
//                           Reviewer
//                           {sortConfig.key === 'name' && (
//                             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortConfig.direction === 'ascending' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
//                             </svg>
//                           )}
//                         </div>
//                       </th>
//                       <th 
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                         onClick={() => handleSort('rating')}
//                       >
//                         <div className="flex items-center">
//                           Rating
//                           {sortConfig.key === 'rating' && (
//                             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortConfig.direction === 'ascending' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
//                             </svg>
//                           )}
//                         </div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {reviews.map((review) => (
//                       <tr key={review._id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="bg-indigo-100 text-indigo-800 rounded-full p-2 mr-3">
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                               </svg>
//                             </div>
//                             <div className="text-sm font-medium text-gray-900">{review.name}</div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <RatingStars rating={review.rating} />
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-700 line-clamp-2">{review.comment}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEdit(review)}
//                               className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
//                               title="Edit review"
//                             >
//                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() => handleDelete(review._id)}
//                               className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                               title="Delete review"
//                             >
//                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                               </svg>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
//                 <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
//                 </svg>
//                 <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
//                 <p className="mt-2 text-gray-500">Be the first to review this product!</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Reusable Input component
// const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon, ...props }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//     <div className="relative">
//       {icon && (
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           {icon}
//         </div>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${icon ? 'pl-10' : 'pl-4'} pr-4`}
//         {...props}
//       />
//     </div>
//   </div>
// );

// // Reusable Textarea component
// const TextareaField = ({ label, name, value, onChange, placeholder, icon }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//     <div className="relative">
//       {icon && (
//         <div className="absolute top-3 left-3 pointer-events-none">
//           {icon}
//         </div>
//       )}
//       <textarea
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         rows="4"
//         className={`w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${icon ? 'pl-10' : 'pl-4'} pr-4`}
//       />
//     </div>
//   </div>
// );

// export default AddReviews;


import React, { useState, useEffect } from "react";
import axios from "axios";

const AddReviews = () => {
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    comment: "",
    productId: "",
  });

  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch all products
  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const response = await axios.get(`https://ishmiherbal.com/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setMsg({ text: "Failed to fetch products", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMsg({ text: "Failed to fetch products", type: "error" });
    } finally {
      setProductLoading(false);
    }
  };

  // Fetch all combos
  const fetchCombos = async () => {
    try {
      const res = await axios.get(`https://ishmiherbal.com/api/combos/list`);
      setCombos(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMsg({ text: "Failed to fetch combos", type: "error" });
    }
  };

  // Fetch reviews for a product
  const fetchReviews = async () => {
    if (!form.productId) return;
    try {
      setLoading(true);
      const res = await fetch(`https://ishmiherbal.com/api/reviews/product/${form.productId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
      setMsg({ text: "Failed to fetch reviews", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCombos();
  }, []);

  useEffect(() => {
    if (form.productId) {
      fetchReviews();
    }
  }, [form.productId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setForm({ ...form, productId });
  };

  const handleRatingClick = (rating) => {
    setForm({ ...form, rating });
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    // Validation
    if (!form.name || !form.rating || !form.comment || !form.productId) {
      setMsg({ text: "Please fill all fields", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const url = editingId
        ? `https://ishmiherbal.com/api/reviews/${editingId}`
        : "https://ishmiherbal.com/api/reviews/add";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ 
          text: editingId ? "Review updated successfully!" : "Review added successfully!", 
          type: "success" 
        });
        setForm({ name: "", rating: 0, comment: "", productId: form.productId });
        setEditingId(null);
        fetchReviews();
      } else {
        setMsg({ text: data.message, type: "error" });
      }
    } catch (error) {
      setMsg({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setForm({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      productId: review.product,
    });
    setEditingId(review._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`https://ishmiherbal.com/api/reviews/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: "Review deleted successfully", type: "success" });
        fetchReviews();
      } else {
        setMsg({ text: data.message, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMsg({ text: "Failed to delete review", type: "error" });
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedReviews = [...reviews].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setReviews(sortedReviews);
  };

  const RatingStars = ({ rating, interactive = false, onRate, onHover, onLeave }) => {
    const displayRating = interactive ? (hoverRating || rating) : rating;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "div"}
            onClick={interactive ? () => onRate(star) : null}
            onMouseEnter={interactive ? () => onHover(star) : null}
            onMouseLeave={interactive ? onLeave : null}
            className={`p-1 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
          >
            <svg
              className={`w-6 h-6 ${star <= displayRating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {!interactive && <span className="ml-2 text-sm text-gray-600">({rating})</span>}
      </div>
    );
  };

  const getProductName = (productId) => {
    // First check in products
    const product = products.find(p => p._id === productId);
    if (product) return product.name;
    
    // Then check in combos
    const combo = combos.find(c => c._id === productId);
    if (combo) return combo.name;
    
    return "Unknown Product/Combo";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Review Management System
          </h1>
          <p className="text-gray-600 mt-2">Add and manage product and combo reviews with ease</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              {editingId ? "Update Review" : "Add New Review"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", rating: 0, comment: "", productId: form.productId });
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel Edit
              </button>
            )}
          </div>
          
          {msg.text && (
            <div className={`mb-6 p-4 rounded-xl ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              <div className="flex items-center">
                {msg.type === "success" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
                {msg.text}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Your Name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              type="text" 
              placeholder="Enter your name"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              }
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <RatingStars 
                  rating={form.rating} 
                  interactive={true}
                  onRate={handleRatingClick}
                  onHover={handleRatingHover}
                  onLeave={handleRatingLeave}
                />
                <div className="mt-2 text-sm text-gray-500">
                  {form.rating > 0 ? `Selected: ${form.rating} star${form.rating > 1 ? 's' : ''}` : 'Click to rate'}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <TextareaField 
                label="Your Review" 
                name="comment" 
                value={form.comment} 
                onChange={handleChange} 
                placeholder="Share your detailed experience with this product or combo"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                }
              />
            </div>
            
            <div className="md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product or Combo</label>
                <div className="relative">
                  <select
                    name="productId"
                    value={form.productId}
                    onChange={handleProductChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Choose a product or combo to review</option>
                    
                    {/* Products Section */}
                    {products.length > 0 && (
                      <optgroup label="Products">
                        {products.map((product) => (
                          <option key={`product-${product._id}`} value={product._id}>
                            {product.name} (Product)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    
                    {/* Combos Section */}
                    {combos.length > 0 && (
                      <optgroup label="Combos">
                        {combos.map((combo) => (
                          <option key={`combo-${combo._id}`} value={combo._id}>
                            {combo.name} (Combo)
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {editingId ? "Update Review" : "Submit Review"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Reviews Table */}
        {form.productId && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  Product/Combo Reviews
                </h3>
                <p className="text-gray-600 text-sm">Showing reviews for: <span className="font-medium text-indigo-600">{getProductName(form.productId)}</span></p>
              </div>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button 
                  onClick={fetchReviews}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </button>
                
                <div className="relative">
                  <select 
                    className="pl-3 pr-8 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium appearance-none"
                    onChange={(e) => handleSort(e.target.value)}
                    value={sortConfig.key}
                  >
                    <option value="">Sort by</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="createdAt">Date</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : reviews.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Reviewer
                          {sortConfig.key === 'name' && (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortConfig.direction === 'ascending' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                            </svg>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('rating')}
                      >
                        <div className="flex items-center">
                          Rating
                          {sortConfig.key === 'rating' && (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortConfig.direction === 'ascending' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                            </svg>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 text-indigo-800 rounded-full p-2 mr-3">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{review.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RatingStars rating={review.rating} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 line-clamp-2">{review.comment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="Edit review"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete review"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-2 text-gray-500">Be the first to review this product or combo!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input component
const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${icon ? 'pl-10' : 'pl-4'} pr-4`}
        {...props}
      />
    </div>
  </div>
);

// Reusable Textarea component
const TextareaField = ({ label, name, value, onChange, placeholder, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute top-3 left-3 pointer-events-none">
          {icon}
        </div>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
        className={`w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${icon ? 'pl-10' : 'pl-4'} pr-4`}
      />
    </div>
  </div>
);

export default AddReviews;