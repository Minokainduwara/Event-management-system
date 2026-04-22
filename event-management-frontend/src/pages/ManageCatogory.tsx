import React from 'react'
import Header from '../components/Header'
import Body from '../components/Body'
import { Link } from 'react-router-dom'

function ManageCatogory() {
    const catogories=[
       {
        id:1,
        type:"Technology",
        description:"lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        count:3,
        
       },
         {
           id: 2,
           type:"Cultural",
           description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
           count: 5,
         },
         {
           id: 3,
              type:"Sports",
           description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
           count: 8,
         }
    ]
  return (
    <div>
   <Header/>
   <Body>
  <div>
    <div className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between p-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Manage Categories
                    </h1>
                    <p className="mt-1 text-gray-600">
                      Organize events by categories
                    </p>
                  </div>
                  <Link
                    to="/admin/catogory/add"
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Create New Catogory
                  </Link>
                </div>
              </div>
              <div className="flex justify-center mt-6">
  <div className="bg-white rounded-lg overflow-x-auto overflow-y-auto max-h-[400px]">
    <table className="min-w-full w-[1300px] h-[300px] border-gray-200 shadow-lg w-border">


      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left">Id</th>
          <th className="px-4 py-3 text-left">Catogory</th>
          <th className="px-4 py-3 text-left">Discription</th>
          <th className="px-4 py-3 text-left">Count</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>

     
      <tbody>
        {catogories.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-4 text-center text-gray-500">
              No categories found
            </td>
          </tr>
        ) : (
          catogories.map((catogory) => (
            <tr key={catogory.id} className=" hover:bg-gray-50">
              <td className="px-4 py-3">{catogory.id}</td>
              <td className="px-4 py-3">{catogory.type}</td>
              <td className="px-4 py-3">{catogory.description}</td>
              <td className="px-4 py-3">{catogory.count}</td>
              <td className="px-4 py-3 space-x-2 text-center">
               <Link to={`/admin/catogory/edit/${catogory.id}`} className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                  Edit
               </Link>
                <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
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
  </div>
   </Body>

    </div>
  )
}

export default ManageCatogory