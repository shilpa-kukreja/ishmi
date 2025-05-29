import React, { useEffect, useState } from "react";
import axios from "axios";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/contact/get");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const response = await axios.post("http://localhost:5000/api/contact/remove", { id });
      alert(response.data.message);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Error deleting contact", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      <h1 className="text-xl font-extrabold text-center mb-10 text-gray-800 shadow-md bg-white py-5 rounded-lg">
        Admin Panel - Contact Submissions
      </h1>
      {loading ? (
        <p className="text-center text-xl font-semibold text-gray-600">Loading contacts...</p>
      ) : contacts.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-400 text-white">
              <tr>
                <th className="p-4 text-sm font-semibold">Name</th>
                <th className="p-4 text-sm font-semibold">Email</th>
                <th className="p-4 text-sm font-semibold">Message</th>
                <th className="p-4 text-sm font-semibold">Submitted At</th>
                <th className="p-4 text-sm font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr
                  key={contact._id}
                  className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all`}
                >
                  <td className="p-4 text-sm text-gray-700">{contact.name}</td>
                  <td className="p-4 text-sm text-gray-700">{contact.email}</td>
                  <td className="p-4 text-sm text-gray-700 truncate max-w-xs">{contact.message}</td>
                  <td className="p-4 text-sm text-gray-700">{new Date(contact.submittedAt).toLocaleString()}</td>
                  <td className="p-4 text-sm text-center">
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="bg-red-500 text-sm text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg py-12 px-8 text-center">
          <p className="text-2xl font-semibold text-gray-700">No submissions yet. 😔</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
