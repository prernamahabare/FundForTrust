import { Link } from "react-router-dom";
import { FiGrid, FiBarChart2, FiBell, FiUser, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="h-screen w-16 bg-gray-900 text-white flex flex-col items-center py-4 fixed left-0 top-0 z-50">
      <div className="flex flex-col gap-6 mt-10">
        <Link to="/display-campaign">
          <FiGrid className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Campaigns" />
        </Link>
        <Link to="/create-campaign">
          <FiBarChart2 className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Create Campaign" />
        </Link>
        {/* <Link to="/"> */}
          <FiBell className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Notifications" />
        {/* </Link> */}
        <Link to="/profile">
          <FiUser className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Profile" />
        </Link>
      </div>
      <div className="mt-auto pb-4">
        {/* <Link to="/settings"> */}
          <FiSettings className="w-6 h-6 cursor-pointer hover:text-gray-400" title="Settings" />
        {/* </Link> */}
      </div>
    </div>
  );
};

export default Sidebar;
