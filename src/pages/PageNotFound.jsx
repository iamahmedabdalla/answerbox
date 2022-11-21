import React from 'react'
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-9xl font-bold text-red-500">404</h1>
        <h1 className="text-5xl font-bold text-gray-500">Page Not Found</h1>
        <button 
        onClick={() => navigate(-1)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go Back
        </button>
    </div>

  )
}

export default PageNotFound