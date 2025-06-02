import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListCombos = () => {
  const [combos, setCombos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ishmiherbal.com/api/combos/list');
      setCombos(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch combos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this combo?')) return;
    
    try {
      await axios.delete(`https://ishmiherbal.com/api/combos/remove/${id}`);
      toast.success('Combo deleted successfully');
      fetchCombos();
    } catch (err) {
      console.error('Error deleting combo', err);
      toast.error(err.response?.data?.error || 'Failed to delete combo');
    }
  };

  const handleEdit = (combo) => {
    navigate(`/addcombos/${combo._id}`, { state: { combo } });
  };

  const filteredCombos = combos.filter((combo) =>
    combo.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCombos.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCombos = filteredCombos.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    fetchCombos();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Combo List</h2>
        <button
          onClick={() => navigate('/addcombos')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add New Combo
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-full md:w-64"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading combos...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 shadow-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Sku</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCombos.length > 0 ? (
                  paginatedCombos.map((combo, index) => (
                    <tr key={combo._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{startIdx + index + 1}</td>
                      <td className="p-3 border">
                        <img
                          src={combo.thumbImg ? `https://ishmiherbal.com/uploads/thumbImg/${combo.thumbImg}` : '/placeholder-product.jpg'}
                          alt={combo.name}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </td>
                      <td className="p-3 border font-medium">{combo.name}</td>
                      <td className="p-3 border">
                        <span className="text-green-700 font-semibold">
                          ₹{combo.discountedprice || combo.actualprice}
                        </span>
                        {combo.discountedprice && (
                          <span className="text-gray-500 line-through ml-2">
                            ₹{combo.actualprice}
                          </span>
                        )}
                      </td>
                      <td className="p-3 border font-medium">{combo.sku}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => navigate(`/addcombos/${combo._id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(combo._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No combos found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredCombos.length > itemsPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListCombos;