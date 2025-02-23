import { Link } from "react-router-dom";
import { FiGrid, FiBarChart2, FiBell, FiUser, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col h-screen w-[76px] bg-[#1c1c24] text-white fixed left-0 top-0 z-50 pt-5 shadow-lg items-center py-4">
    {/* <aside className="hidden md:flex flex-col h-screen w-[76px] bg-[#1c1c24] text-white fixed left-0 top-0 z-50 pt-5 rounded-[20px] shadow-lg items-center py-4"> */}
        <div className="flex flex-col gap-6 mt-12 items-center flex-1">
          <Link to="/display-campaign">
            <div className="w-[48px] h-[48px] flex justify-center items-center rounded-[10px] bg-[#2c2f32] cursor-pointer hover:bg-[#3a3d4b]">
              <FiGrid className="w-6 h-6 text-white" title="Campaigns" />
            </div>
          </Link>
          <Link to="/create-campaign">
            <div className="w-[48px] h-[48px] flex justify-center items-center rounded-[10px] bg-[#2c2f32] cursor-pointer hover:bg-[#3a3d4b]">
              <FiBarChart2 className="w-6 h-6 text-white" title="Create Campaign" />
            </div>
          </Link>
          <div className="w-[48px] h-[48px] flex justify-center items-center rounded-[10px] bg-[#2c2f32] cursor-pointer hover:bg-[#3a3d4b]">
            <FiBell className="w-6 h-6 text-white" title="Notifications" />
          </div>
          <Link to="/profile">
            <div className="w-[48px] h-[48px] flex justify-center items-center rounded-[10px] bg-[#2c2f32] cursor-pointer hover:bg-[#3a3d4b]">
              <FiUser className="w-6 h-6 text-white" title="Profile" />
            </div>
          </Link>
        </div>
        <div className="pb-4 flex justify-center">
          <div className="w-[48px] h-[48px] flex justify-center items-center rounded-[10px] bg-[#1c1c24] shadow-secondary cursor-pointer hover:bg-[#3a3d4b]">
            <FiSettings className="w-6 h-6 text-white" title="Settings" />
          </div>
        </div>
      </aside>
      );
};

      export default Sidebar;
