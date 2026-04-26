import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { useParams } from "react-router-dom";

type Student = {
  registration_id: number;
  studentName: string;
  universityId: string;
  email: string;
  status: string;
};

function AdminEventStudent() {
  const { eventId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!eventId) return;

    apiFetch(`http://localhost:8080/eventRegistrations/event/${eventId}`)
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch((err) => console.log(String(err)));
  }, [eventId]);

  return (
    <div>
      <Header />
      <Body>
        <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Registered Students</h1>
          <p className="text-gray-500">Students registered for this event</p>
        </div>

        <div className="p-6">
          <table className="w-full border border-gray-200 rounded-lg shadow-lg">
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
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.registration_id} className="hover:bg-gray-100">
                    <td className="px-4 py-3">{s.studentName}</td>
                    <td className="px-4 py-3">{s.universityId}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">{s.status}</td>
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

export default AdminEventStudent;