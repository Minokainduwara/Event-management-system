import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
function AdminAddEvent() {
  const [banner, setBanner] = React.useState<string | null>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <Header />
      <Body>
        <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500">
            Fill in the details to create a new university event
          </p>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-4">
          <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create New Event
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                placeholder="Enter event description"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Time<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Participants
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter maximum number of participants (optional)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Category<span className="text-red-500">*</span>
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Career">Career</option>
                <option value="Academic">Academic</option>
                <option value="Networking">Networking</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="block w-full text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {banner && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={banner}
                    alt="Event Banner Preview"
                    className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition-colors"
            >
              Create Event
            </button>
          </form>
        </div>
      </Body>
    </div>
  );
}

export default AdminAddEvent;
