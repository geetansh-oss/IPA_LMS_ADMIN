import React from "react";
import { Link } from "react-router-dom";
import { ChartNoAxesColumn, SquareLibrary, FolderPlus } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="hidden md:block w-64 h-full border-r border-gray-300 p-4">
      <nav className="space-y-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium">
          <ChartNoAxesColumn size={20} />
          Dashboard
        </Link>
        <Link to="/course" className="flex items-center gap-2 text-sm font-medium">
          <SquareLibrary size={20} />
          Courses
        </Link>
        <Link to="/course/create" className="flex items-center gap-2 text-sm font-medium">
          <FolderPlus size={20} />
          Create Course
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
