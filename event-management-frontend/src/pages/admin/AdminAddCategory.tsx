import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { client } from "../api/client";

function AdminAddCategory() {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!category.categoryName || !category.description) {
      alert("Fill all fields");
      return;
    }

    await client.post("/category/addCategory", category);
    alert("Category added");
    navigate("/catogory");
  };

  return (
    <div>
      <Header />

      <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
        <input
          name="categoryName"
          placeholder="Category Name"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <button className="bg-green-500 text-white px-4 py-2">
          Create
        </button>
      </form>
    </div>
  );
}

export default AdminAddCategory;