import { Link } from "react-router-dom";
import { FiGrid, FiBarChart2, FiBell, FiUser, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col h-screen w-16 bg-gray-900 text-white fixed left-0 top-0 z-50 pt-16">
      <div className="flex flex-col gap-6 mt-10 items-center">
        <Link to="/display-campaign">
          <FiGrid className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Campaigns" />
        </Link>
        <Link to="/create-campaign">
          <FiBarChart2 className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Create Campaign" />
        </Link>
        <FiBell className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Notifications" />
        <Link to="/profile">
          <FiUser className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Profile" />
        </Link>
      </div>
      <div className="mt-auto pb-4 flex justify-center">
        <FiSettings className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;