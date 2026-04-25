import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";
function ViewStudent() {
  type Student = {
    userId: number;
    universityId: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    year: string;
    //created_at: Date;
    eventsRegistered: number;
  };
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    apiFetch("http://localhost:8080/users/students/count")
      .then((res) => res.json())
      .then((data) => setTotalStudents(data))
      .catch((err) => console.log(String(err)));
  }, []);

  const fetchAllStudents = () => {
    apiFetch("http://localhost:8080/users/getAllStudents")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.log("Unexpected response:", data);
          setStudents([]);
        }
      })
      .catch((err) => console.log(String(err)));
  };
  const searchStudents = (keyword: string) => {
    apiFetch(`http://localhost:8080/users/students/search?keyword=${keyword}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.log(String(err)));
  };
  const filterByDepartment = (dept: string) => {
    if (dept === "") {
      fetchAllStudents();
    } else {
      apiFetch(`http://localhost:8080/users/students/department/${dept}`)
        .then((res) => res.json())
        .then((data) => setStudents(data))
        .catch((err) => console.log(String(err)));
    }
  };
  useEffect(() => {
    fetchAllStudents();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value === "") {
      filterByDepartment(department);
    } else {
      searchStudents(value);
    }
  };
  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    filterByDepartment(dept);
  };

  const handleDelete = (id: number) => {
    apiFetch(`http://localhost:8080/users/deleteUser/${id}`, { method: "DELETE" })
      .then(() => {
        setStudents((prev) => prev.filter((student) => student.userId !== id));
      })
      .catch((err) => console.log(String(err)));
  };
  return (
    <div>
      <Header />
      <Body>
        <div className="flex justify-between items-center  border-b mb-8 border-gray-200">
          <div className=" pl-10 h-[140px] pt-8">
            <h1 className="text-3xl font-bold text-gray-900">View Students</h1>
            <p className="text-gray-600 mt-1">
              Manage student accounts and information
            </p>
          </div>
          <div className="pr-10">
            <h3 className="text-2xl font-bold text-blue-700">
              {totalStudents}
            </h3>
            <h3 className="text-gray-600 text-sm">Total Students</h3>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-300 p-6 mb-6 ml-8 mr-8">
          <div className="flex gap-4 flex justify-between ">
            <div className="pl-10 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="76"
                height="76"
                viewBox="0 0 76 76"
                fill="none"
                className="absolute left-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              >
                <path
                  d="M34.3995 59.4171C48.2164 59.4171 59.4173 48.2163 59.4173 34.3994C59.4173 20.5824 48.2164 9.38159 34.3995 9.38159C20.5826 9.38159 9.38171 20.5824 9.38171 34.3994C9.38171 48.2163 20.5826 59.4171 34.3995 59.4171Z"
                  stroke="#99A1AF"
                  strokeWidth="6.25444"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M65.6717 65.6715L52.2246 52.2245"
                  stroke="#99A1AF"
                  strokeWidth="6.25444"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="   Search by Student name or department.."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-[1000px] px-4  py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="pr-10 relative ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="140"
                height="140"
                viewBox="0 0 140 140"
                fill="none"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400  "
              >
                <path
                  d="M58.0221 116.044C58.0216 117.122 58.3216 118.179 58.8883 119.097C59.4551 120.014 60.2662 120.755 61.2307 121.237L72.8351 127.039C73.7199 127.481 74.7031 127.69 75.6912 127.645C76.6793 127.6 77.6396 127.304 78.4808 126.783C79.322 126.263 80.0163 125.536 80.4976 124.672C80.9789 123.808 81.2313 122.835 81.2309 121.846V81.2308C81.2322 78.3552 82.3012 75.5824 84.2306 73.4501L126.14 27.0964C126.891 26.2641 127.385 25.2321 127.562 24.125C127.739 23.0179 127.591 21.8833 127.137 20.8583C126.683 19.8333 125.942 18.9619 125.003 18.3493C124.064 17.7368 122.967 17.4094 121.846 17.4067H17.4068C16.2847 17.4071 15.1868 17.7329 14.246 18.3446C13.3053 18.9563 12.5621 19.8276 12.1065 20.853C11.6509 21.8785 11.5024 23.014 11.679 24.1221C11.8556 25.2303 12.3498 26.2634 13.1016 27.0964L55.0224 73.4501C56.9518 75.5824 58.0208 78.3552 58.0221 81.2308V116.044Z"
                  stroke="#99A1AF"
                  strokeWidth="11.6044"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <select
                onChange={(e) => handleDepartmentChange(e.target.value)}
                value={department}
                className="px-4 py-3   border border-gray-300 rounded-lg"
              >
                <option value="">All Departments</option>
                <option value="ICT Department">ICT Department</option>
                <option value="ET Department">ET Department</option>
                <option value="BST Department">BST Department</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <div className="overflow-x-auto  overflow-y-auto max-h-[400px]  rounded-lg">
            <table className="w-[1200px] mt-8 border-collapse border-md  shadow-lg border-gray-300">
              <thead className="bg-gray-200">
                <tr className="  text-left">
                  <th className="px-4 py-3 ">Id</th>
                  <th className="px-4 py-3">University Id</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Registered Date</th>
                  <th className="px-4 py-3">No Reg Events</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => (
                  <tr className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="px-4 py-3 font-semibold text-md ">
                      {"#"}
                      {student.userId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md ">
                      {student.universityId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md ">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md">
                      {student.phone}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md ">
                      {student.email}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md ">
                      {student.department}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md ">
                      {student.year}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md text-gray-600">
                      {student.created_at
                        ? new Date(student.created_at).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-4 py-3 font-semibold text-md text-gray-600">
                      {student.eventsRegistered}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(student.userId)}
                        className="bg-red-500   px-1 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div></div>
      </Body>
    </div>
  );
}

export default ViewStudent;
