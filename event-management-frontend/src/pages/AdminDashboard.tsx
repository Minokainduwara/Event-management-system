import React from 'react'
import Header from '../components/Header'
import Body from '../components/Body'


function AdminDashboard() {

  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2026",
      description:
        "Join us for an exciting day of technological innovations, featuring expert speakers from leading tech companies.",
      date: "Nov 7, 2024",
      time: "10:00 Registered",
      location: "Main Campus Ground",
      organizer: "University Auditorium",
      image:
        "https://images.unsplash.com/photo-1761388559873-40bfb05f39e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Technology",
      registered: 247,
    },
    {
      id: 2,
      title: "Annual Cultural Fest",
      description:
        "Experience vibrant cultures from around the world through music, food, and art. A celebration of diversity.",
      date: "Dec 15, 2024",
      time: "11:00 Registered",
      location: "Main Campus Ground",
      organizer: "Main Campus Ground",
      image:
        "https://images.unsplash.com/photo-1761124739933-009df5603fbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Cultural",
      registered: 189,
    },
    {
      id: 3,
      title: "AI & Machine Learning Workshop",
      description:
        "Hands-on workshops covering the fundamentals of AI and ML, featuring practical projects and industry experts.",
      date: "Jan 20, 2025",
      time: "09:00 Registered",
      location: "CS Lab #01",
      organizer: "CS Lab #01",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      tag: "Workshop",
      registered: 156,
    },
  ];

  return (
    <>
      <Header />
      <Body>
        <div className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl font-bold mb-4">
              Discover and Manage University Events
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Join exciting campus events, connect with peers, and make the most
              of
              <br />
              your university experience
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Explore Events →
            </button>
          </div>
        </div>
      </Body>

      <Body>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="76"
                height="76"
                viewBox="0 0 76 76"
                fill="none"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                placeholder="Search events..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All</option>
              <option value="technology">Technology</option>
              <option value="cultural">Cultural</option>
              <option value="workshop">Workshop</option>
              <option value="sports">Sports</option>
              <option value="academic">Academic</option>
            </select>
          </div>
        </div>
      </Body>

      <Body>
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
            <span className="text-gray-600">{events.length} events found</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(function (items) {
              return (
                <div
                  key={items.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={items.image}
                    alt={items.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{items.title}</h3>
                    <p className="text-gray-600">{items.description}</p>

                    <div className="mt-2">
                      <div className="flex items-center gap-2 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="87"
                          height="87"
                          viewBox="0 0 87 87"
                          fill="none"
                          className="w-5 h-5"
                        >
                          <path
                            d="M28.9819 7.24561V21.7366"
                            stroke="#155DFC"
                            strokeWidth="7.24547"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M57.9639 7.24561V21.7366"
                            stroke="#155DFC"
                            strokeWidth="7.24547"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M68.8324 14.491H18.1141C14.1126 14.491 10.8687 17.7349 10.8687 21.7364V72.4548C10.8687 76.4563 14.1126 79.7002 18.1141 79.7002H68.8324C72.834 79.7002 76.0779 76.4563 76.0779 72.4548V21.7364C76.0779 17.7349 72.834 14.491 68.8324 14.491Z"
                            stroke="#155DFC"
                            strokeWidth="7.24547"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.8687 36.2273H76.0779"
                            stroke="#155DFC"
                            strokeWidth="7.24547"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="text-sm text-gray-500">
                          {items.date} at {items.time}
                        </span>
                      </div>

                      <span className="text-sm text-gray-500">
                        {items.location}
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        Organized by: {items.organizer}
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        {items.registered} registered
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Body>
    </>
  );
}

export default AdminDashboard;