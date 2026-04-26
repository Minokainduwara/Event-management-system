import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";

function AdminEditCatogory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  type Category = {
    categoryId: number;
    category_name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };

  const [category, setCategory] = useState<Category>({
    categoryId: 0,
    category_name: "",
    description: "",
    created_at: "",
    updated_at: "",
  });
  useEffect(() => {
    apiFetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(String(err)));
  }, []);
  useEffect(() => {
    apiFetch(`http://localhost:8080/category/getCategory/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .catch((err) => console.log(String(err)));
  }, [id]);

   const formatDateTime = (dateString: string) => {
  if (!dateString) return "";

  const d = new Date(dateString);

  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    " " +
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
};
  

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    apiFetch(`http://localhost:8080/category/updateCategory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
      .then(() => {
        alert("Category Updated!");
        navigate("/catogory");
      })
      .catch((err) => alert("Error updating category: " + String(err)));
  };
  return (
    <div>
      <Header />
      <div>
        <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200 ">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Event Category
          </h1>
          <p className="text-gray-500">
            Fill in the details to edit the event category
          </p>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white w-[420px] p-6 rounded-xl shadow-lg mt-4"
            >
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                Edit Category
              </h2>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category Id <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  name="categoryId"
                  value={category.categoryId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={category.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a category</option>
                          {categories.map((category: any) => (
                            <option
                              key={category.categoryId}
                              value={String(category.categoryId)}
                            >
                              {category.categoryName}
                            </option>
                          ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required 
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Created At <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  name="createdAt"
                  value={formatDateTime(category.created_at)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Last Updated <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  name="updated_at"
                  value={formatDateTime(category.updated_at)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                className="w-full mb-2 py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Update Category
              </button>
              <button
                type="button"
                onClick={() => navigate("/catogory")}
                className="w-full py-2 text-white transition duration-200 bg-red-500 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEditCatogory;
