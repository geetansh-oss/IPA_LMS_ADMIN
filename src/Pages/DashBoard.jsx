import React from 'react';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  return (
    <div className="text-blue-600">
      <Link to={"/CreateCourse"} className='flex items-center'>Create</Link>
    </div>
  )
}

export default DashBoard
