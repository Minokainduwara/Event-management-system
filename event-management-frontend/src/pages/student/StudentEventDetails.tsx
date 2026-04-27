import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import StudentHeader from "../../components/StudentHeader";
import { authFetch } from "../../utils/authFetch";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isRegistered, setIsRegistered] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    authFetch(`http://localhost:8080/events/getEvent/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setIsRegistered(!!data.isRegistered);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // ✅ SAFE CALCULATIONS
  const spotsLeft =
    event ? event.maxParticipants - event.registered : 0;

  const availabilityPercentage =
    event && event.maxParticipants
      ? (event.registered / event.maxParticipants) * 100
      : 0;

  const handleRegister = async () => {
    if (!event) return;

    if (window.confirm(`Confirm registration for "${event.eventTitle || event.name}"?`)) {
      try {
        const res = await authFetch(`http://localhost:8080/eventRegistrations/register?userId=8&eventId=${id}`, {
          method: "POST",
          body: JSON.stringify({ eventId: Number(id) })
        });

        if (res.ok) {
          setIsRegistered(true);

          setEvent((prev: any) => ({
            ...prev,
            registered: prev.registered + 1
          }));
        } else {
          alert("Failed to register. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred during registration.");
      }
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading event details...
      </div>
    );
  }

  // ✅ NULL SAFE GUARD
  if (!event) {
    return (
      <div className="p-6 text-center text-red-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            {event.eventTitle || event.name}
          </h1>

          <div className="flex items-center gap-4 mt-2">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {event.category?.categoryName}
            </span>

            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
              {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <img
                src={`http://localhost:8080/${event.image}`}
                alt={event.eventTitle}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">

              <h2 className="text-lg font-semibold mb-4">Event Details</h2>

              <div className="space-y-4 mb-6">

                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold">Date</div>
                    <div className="text-sm text-gray-600">
                      {event.eventDate && formatDate(event.eventDate)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold">Time</div>
                    <div className="text-sm text-gray-600">{event.eventTime}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold">Venue</div>
                    <div className="text-sm text-gray-600">{event.location}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold">Participants</div>
                    <div className="text-sm text-gray-600">
                      {event.registered}/{event.maxParticipants}
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${availabilityPercentage}%` }}
                      />
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {spotsLeft} spots remaining
                    </div>
                  </div>
                </div>
              </div>

              {isRegistered ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-semibold text-green-900">
                      Registered
                    </div>
                    <div className="text-xs text-green-700">
                      You're all set for this event!
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={spotsLeft <= 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300"
                >
                  {spotsLeft > 0 ? "Register for Event" : "Event Full"}
                </button>
              )}

              <Link
                to="/student/events"
                className="block text-center mt-3 border py-3 rounded-lg"
              >
                Browse More Events
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EventDetails;