import React from 'react';
import Users from '../Components/dashBoard/Users';

const DashBoard = () => {

  return (
    <div className="h-full w-full text-white p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className='flex items-center justify-center'>
        <Users />
      </div>
    </div>
  )
}

export default DashBoard;
