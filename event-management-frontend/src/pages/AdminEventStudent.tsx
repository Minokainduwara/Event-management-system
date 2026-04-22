import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function AdminEventStudent() {
  const { eventId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/eventRegistrations/event/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API RESPONSE:", data);
        setStudents(data);
      });
  }, [eventId]);
  return (
    <div>
      <Header />
      <Body>
        <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Show Students</h1>
          <p className="text-gray-500">
            show all students registered for the event
          </p>
        </div>
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Registered Students
      </h1>

      <table className="w-full border border border-gray-200 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">University ID</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No students registered for this event.
              </td>
            </tr>
          ) : (
            students.map((s: any) => (
              <tr key={s.registration_id} className="hover:bg-gray-100">
                <td className="px-4 py-3 font-semibold text-md">{s.studentName}</td>
                <td className="px-4 py-3 font-semibold text-md">{s.universityId}</td>
                <td className="px-4 py-3 font-semibold text-md">{s.email}</td>
              <td className="px-4 py-3 font-semibold text-md">{s.status}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
      </Body>
    </div>
  );
}

export default AdminEventStudent;
