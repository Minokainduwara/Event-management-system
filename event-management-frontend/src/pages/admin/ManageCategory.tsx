import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { Link } from "react-router-dom";

type Category = {
  categoryId: number;
  categoryName: string;
  description: string;
  eventCount?: number;
};

function ManageCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("http://localhost:8080/category/getCategories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(String(err));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    try {
      const res = await apiFetch(
        `http://localhost:8080/category/deleteCategory/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCategories((prev) =>
          prev.filter((cat) => cat.categoryId !== id)
        );
      }
    } catch (err) {
      console.log(String(err));
    }
  };

  return (
    <div>
      <Header />
      <Body>
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-8">
            <div>
              <h1 className="text-3xl font-bold">Manage Categories</h1>
              <p className="text-gray-600">Organize events by categories</p>
            </div>

            <Link
              to="/admin/category/add"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Create New Category
            </Link>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Events</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-gray-100">
                    <td>{cat.categoryId}</td>
                    <td>{cat.categoryName}</td>
                    <td>{cat.description}</td>
                    <td>{cat.eventCount ?? 0}</td>

                    <td className="space-x-2">
                      <Link
                        to={`/admin/category/edit/${cat.categoryId}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteCategory(cat.categoryId)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Body>
    </div>
  );
}

export default ManageCategory;