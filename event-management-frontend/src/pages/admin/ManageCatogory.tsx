import React, { useEffect } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { Link } from "react-router-dom";

function ManageCatogory() {
  const [categories, setCategories] = React.useState([]);

  const fetchCategories = () => {
    apiFetch("http://localhost:8080/category/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(String(err)));
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = (id: number) => {
    apiFetch(`http://localhost:8080/category/deleteCategory/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setCategories(
          categories.filter((catogory) => (catogory as any).id !== id),
        );
      })
      .catch((err) => console.log(String(err)));
  };

  return (
    <div>
      <Header />
      <Body>
        <div>
          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between p-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Categories
                </h1>
                <p className="mt-1 text-gray-600">
                  Organize events by categories
                </p>
              </div>
              <Link
                to="/admin/catogory/add"
                className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create New Catogory
              </Link>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-lg overflow-x-auto overflow-y-auto max-h-[400px] shadow-lg w-border">
              <table className="min-w-full w-[1300px] h-[300px] border-gray-200 shadow-lg w-border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Id</th>
                    <th className="px-4 py-3 text-left">Catogory</th>
                    <th className="px-4 py-3 text-left">Discription</th>
                    <th className="px-4 py-3 text-left">No events</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-gray-500"
                      >
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories.map((category: any) => (
                      <tr key={category.id} className=" hover:bg-gray-100">
                        <td className="px-4 py-3 font-semibold text-md">{category.categoryId}</td>
                        <td className="px-4 py-3 font-semibold text-md">{category.categoryName}</td>
                        <td className="px-4 py-3 font-semibold text-md">{category.description}</td>
                        <td className="px-4 py-3 font-semibold text-md">{category.eventCount}</td>
                        <td className="px-4 py-3 space-x-2 text-center">
                          <Link
                            to={`/admin/catogory/edit/${category.categoryId}`}
                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Edit
                          </Link>
                          <button onClick={() => deleteCategory(category.id)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
}

export default ManageCatogory;
