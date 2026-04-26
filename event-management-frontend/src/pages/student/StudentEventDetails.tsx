import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

import { useParams, Link, useNavigate } from "react-router-dom";
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
    const fetchEvent = async () => {
      try {
        const res = await authFetch(
          `http://localhost:8080/events/getEvent/${id}`
        );

        const data = await res.json();

        console.log("Event Data:", data);

        setEvent(data);

        if (data.isRegistered) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Loading event...
        </p>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">
          Event not found
        </p>
      </div>
    );
  }

  const registered = event.registered || 0;
  const maxParticipants = event.maxParticipants || 0;

  const spotsLeft = maxParticipants - registered;

  const availabilityPercentage =
    maxParticipants > 0
      ? (registered / maxParticipants) * 100
      : 0;

  const handleRegister = async () => {
    const confirmRegister = window.confirm(
      `Confirm registration for "${event.eventTitle}"?`
    );

    if (!confirmRegister) return;

    try {
      const res = await authFetch(
        `http://localhost:8080/eventRegistrations/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            eventId: Number(id)
          })
        }
      );

      if (res.ok) {
        setIsRegistered(true);

        setEvent((prev: any) => ({
          ...prev,
          registered: (prev.registered || 0) + 1
        }));

        alert("Successfully registered!");
      } else {
        alert("Failed to register.");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <StudentHeader />

      {/* Header */}
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
            {event.eventTitle}
          </h1>

          <div className="flex items-center gap-4 mt-3">

            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {event.category?.categoryName || "Category"}
            </span>

            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              {event.status}
            </span>

          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

              <img
                src={`http://localhost:8080/${event.image}`}
                alt={event.eventTitle}
                className="w-full h-72 object-cover"
              />

            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Event
              </h2>

              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>

            </div>

          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">

              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Event Details
              </h2>

              <div className="space-y-5 mb-6">

                {/* Date */}
                <div className="flex items-start gap-3">

                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />

                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      Date
                    </div>

                    <div className="text-sm text-gray-600">
                      {formatDate(event.eventDate)}
                    </div>
                  </div>

                </div>

                {/* Time */}
                <div className="flex items-start gap-3">

                  <Clock className="w-5 h-5 text-blue-600 mt-1" />

                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      Time
                    </div>

                    <div className="text-sm text-gray-600">
                      {event.eventTime}
                    </div>
                  </div>

                </div>

                {/* Location */}
                <div className="flex items-start gap-3">

                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />

                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      Venue
                    </div>

                    <div className="text-sm text-gray-600">
                      {event.location}
                    </div>
                  </div>

                </div>

                {/* Participants */}
                <div className="flex items-start gap-3">

                  <Users className="w-5 h-5 text-blue-600 mt-1" />

                  <div className="w-full">

                    <div className="text-sm font-semibold text-gray-700">
                      Participants
                    </div>

                    <div className="text-sm text-gray-600">
                      {registered}/{maxParticipants} registered
                    </div>

                    <div className="mt-2">

                      <div className="w-full bg-gray-200 rounded-full h-2">

                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${availabilityPercentage}%`
                          }}
                        />

                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {spotsLeft} spots remaining
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Registration Section */}
              {isRegistered ? (

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">

                  <CheckCircle className="w-5 h-5 text-green-600" />

                  <div>

                    <div className="text-sm font-semibold text-green-900">
                      Registered
                    </div>

                    <div className="text-xs text-green-700">
                      You're successfully registered.
                    </div>

                  </div>

                </div>

              ) : (
                <>
                  {spotsLeft > 0 ? (

                    <button
                      onClick={handleRegister}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Register for Event
                    </button>

                  ) : (

                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed font-medium"
                    >
                      Event Full
                    </button>

                  )}
                </>
              )}

              {/* Back Button */}
              <Link
                to="/student/events"
                className="block w-full text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium mt-3"
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