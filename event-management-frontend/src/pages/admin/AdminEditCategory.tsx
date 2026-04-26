import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";

type Category = {
  categoryId: number;
  categoryName: string;
  description: string;
  created_at: string;
  updated_at: string;
};

function AdminEditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>({
    categoryId: 0,
    categoryName: "",
    description: "",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    apiFetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    apiFetch(`http://localhost:8080/category/getCategory/${id}`)
      .then((res) => res.json())
      .then(setCategory)
      .catch(console.error);
  }, [id]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    apiFetch(`http://localhost:8080/category/updateCategory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
      .then(() => {
        alert("Category Updated!");
        navigate("/category");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Header />

      <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-gray-500">Update category details</p>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white w-[420px] p-6 rounded-xl shadow-lg">
          
          <input
            readOnly
            value={category.categoryId}
            className="w-full p-2 border mb-4"
          />

          <input
            name="categoryName"
            value={category.categoryName}
            onChange={handleChange}
            className="w-full p-2 border mb-4"
            placeholder="Category Name"
          />

          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            className="w-full p-2 border mb-4"
          />

          <input
            readOnly
            value={formatDateTime(category.created_at)}
            className="w-full p-2 border mb-2"
          />

          <input
            readOnly
            value={formatDateTime(category.updated_at)}
            className="w-full p-2 border mb-4"
          />

          <button className="w-full bg-blue-500 text-white p-2 mb-2">
            Update
          </button>

          <button
            type="button"
            onClick={() => navigate("/category")}
            className="w-full bg-red-500 text-white p-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminEditCategory;