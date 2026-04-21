import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
function AdminAddCatogory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!category.categoryName || !category.description) {
      alert("Please fill in all fields");
      return;
    }
    fetch("http://localhost:8080/category/addCategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    })
      .then(async (res) => {
        const text = await res.text();
        console.log(text);
        if (res.ok) {
          alert("Category Added Successfully!");
          navigate("/catogory");
        } else {
          alert("Error Adding Category");
        }
      })
      .catch(() => alert("Error Adding Category"));
  };
  return (
    <div>
      <Header />
      <Body>
        <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Event Catogory
          </h1>
          <p className="text-gray-500">
            Fill in the details to create a new university event category
          </p>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white w-[420px] p-6 rounded-xl shadow-lg"
            >
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                Create New Category
              </h2>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="categoryName"
                  required
                  placeholder="Category name"
                  value={category.categoryName}
                  onChange={(e) => handleChange(e)}
                  className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required 
                  placeholder="Enter description"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Create Category
              </button>
              <button
                type="button"
                onClick={() => navigate("/catogory")}
                className="w-full mt-2 py-2 text-white transition duration-200 bg-red-500 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </Body>
    </div>
  );
}

export default AdminAddCatogory;
