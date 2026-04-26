
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentHeader from "../../components/StudentHeader";
import { authFetch } from "../../utils/authFetch";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    authFetch(`http://localhost:8080/events/getEvent/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        if (data.isRegistered) {
          setIsRegistered(true);
        }
      })
      .catch((err) => console.log(err));
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


  const spotsLeft = event.maxParticipants - event.registered;
  const availabilityPercentage = (event.registered / event.maxParticipants) * 100;


  const handleRegister = async () => {
    if (window.confirm(`Confirm registration for "${event.name}"?`)) {
      try {
        const res = await authFetch(`http://localhost:8080/eventRegistrations/register`, {
          method: "POST",
          body: JSON.stringify({ eventId: Number(id) })
        });

        if (res.ok) {
          setIsRegistered(true);
          // Update local spots/registered count
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
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {event.category}
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={`http://localhost:8080/${event.image}`}
                alt={event.eventTitle}
                className="w-full h-64 object-cover"
              />
            </div>


            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{event.description}</p>
            </div>


            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700">Organized By</div>
                  <div className="text-sm text-gray-600">{event.organizer}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Contact</div>
                  <div className="text-sm text-gray-600">{event.contactEmail}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Requirements</div>
                  <div className="text-sm text-gray-600">{event.requirements}</div>
                </div>
              </div>
            </div> */}
          </div>


          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>


              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Date</div>
                    <div className="text-sm text-gray-600">{formatDate(event.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Time</div>
                    <div className="text-sm text-gray-600">{event.eventTime}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Venue</div>
                    <div className="text-sm text-gray-600">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Participants</div>
                    <div className="text-sm text-gray-600">
                      {event.registered}/{event.maxParticipants} registered
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${availabilityPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {spotsLeft} spots remaining
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Button */}
              {isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-semibold text-green-900">Registered</div>
                    <div className="text-xs text-green-700">You're all set for this event!</div>
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

              {/* Back Link */}
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
