import React from "react";
import { Link } from "react-router-dom";
import { ChartNoAxesColumn, SquareLibrary, FolderPlus, Share } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-full h-full border-r border-grey-300 bg-slate-800 text-white py-6 px-4">
      <nav className="flex flex-col gap-6">
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
        <Link to="/giveAccess" className="flex items-center gap-2 text-sm font-medium">
          <Share size={20} />
          Give Access
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
