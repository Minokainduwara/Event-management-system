import React from 'react'
import Header from '../components/Header'
import Body from '../components/Body'
function AdminAddCatogory() {
  return (
    <div>
        <Header/>
        <Body>
            <div className="h-[140px] flex flex-col pt-8 pl-10 border-b border-gray-200" >
          <h1 className="text-3xl font-bold text-gray-900">Create New Event Catogory</h1>
          <p className="text-gray-500">
            Fill in the details to create a new university event category
          </p>
        </div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div>
    <form className="bg-white w-[420px] p-6 rounded-xl shadow-lg">
      
      
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Create New Category
      </h2>

      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option>Technology</option>
          <option>Sports</option>
          <option>Cultural</option>
        </select>
      </div>

      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Event Count <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter count"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={6}
          placeholder="Enter description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Create Category
      </button>

    </form>
  </div>
</div>
        
        </Body>
    </div>
  )
}

export default AdminAddCatogory