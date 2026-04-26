import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";

type Student = {
  userId: number;
  universityId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  created_at?: string;
  eventsRegistered: number;
};

function ViewStudent() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  // COUNT
  useEffect(() => {
    apiFetch("http://localhost:8080/users/students/count")
      .then((res) => res.json())
      .then((data) => setTotalStudents(data))
      .catch((err) => console.log(String(err)));
  }, []);

  // LOAD ALL
  const fetchAllStudents = () => {
    apiFetch("http://localhost:8080/users/getAllStudents")
      .then((res) => res.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(String(err)));
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  // SEARCH
  const searchStudents = (keyword: string) => {
    apiFetch(
      `http://localhost:8080/users/students/search?keyword=${keyword}`
    )
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch((err) => console.log(String(err)));
  };

  // SEARCH HANDLER
  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (value.trim() === "") {
      fetchAllStudents();
    } else {
      searchStudents(value);
    }
  };

  // DELETE
  const handleDelete = (id: number) => {
    apiFetch(`http://localhost:8080/users/deleteUser/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setStudents((prev) =>
          prev.filter((student) => student.userId !== id)
        );
        setTotalStudents((prev) => prev - 1);
      })
      .catch((err) => console.log(String(err)));
  };

  return (
    <div>
      <Header />
      <Body>
        {/* HEADER */}
        <div className="flex justify-between items-center border-b mb-8 border-gray-200">
          <div className="pl-10 h-[140px] pt-8">
            <h1 className="text-3xl font-bold text-gray-900">
              View Students
            </h1>
            <p className="text-gray-600 mt-1">
              Manage student accounts and information
            </p>
          </div>

          <div className="pr-10">
            <h3 className="text-2xl font-bold text-blue-700">
              {totalStudents}
            </h3>
            <p className="text-gray-600 text-sm">Total Students</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-lg shadow border p-6 mb-6 mx-8">
          <div className="flex justify-between gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-[1000px] px-4 py-3 border rounded-lg"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="flex justify-center">
          <div className="overflow-auto max-h-[400px]">
            <table className="w-[1200px] border shadow-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th>ID</th>
                  <th>University ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Registered</th>
                  <th>Events</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.userId}
                      className="border-b hover:bg-gray-100"
                    >
                      <td>#{student.userId}</td>
                      <td>{student.universityId}</td>
                      <td>{student.name}</td>
                      <td>{student.phone}</td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td>
                        {student.created_at
                          ? new Date(student.created_at).toLocaleString()
                          : "-"}
                      </td>
                      <td>{student.eventsRegistered}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(student.userId)}
                          className="bg-red-500 px-2 py-1 text-white rounded"
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
        </div>
      </Body>
    </div>
  );
}

export default ViewStudent;