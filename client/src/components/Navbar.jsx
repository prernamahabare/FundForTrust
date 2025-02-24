import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import logo from "../assets/image.png"

const Navbar = ({ connectWallet, address, isConnected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    await connectWallet();
    navigate("/display-campaign");
  };

  return (
    <nav className="bg-[#1c1c24] fixed w-full z-20 top-0 left-0 border-b border-gray-600 shadow-lg pl-[76px]">

    {/* <nav className="bg-[#1c1c24] fixed w-full z-20 top-0 left-0 border-b border-gray-600 shadow-lg"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Sidebar Toggle for Mobile */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white md:hidden">
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-8" alt="Logo" />
          {/* <FcDonate className="h-8"/> */}
          <span className="ml-2 text-2xl font-semibold text-white">CrowdFunding</span>
        </Link>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {!isConnected ? (
            <button
              onClick={handleConnectWallet}
              className="bg-[#8c6dfd] hover:bg-[#7a5cc4] text-white font-medium px-4 py-2 rounded-lg transition"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <Link
                to="/create-campaign"
                className="bg-[#1dc071] hover:bg-[#18a463] text-white font-bold px-6 py-2 rounded-lg transition"
              >
                Create Campaign
              </Link>
              <Link to="/profile" className="text-white text-2xl">
                <FaUserCircle />
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1c1c24] text-white py-2 absolute top-16 w-full left-0 shadow-secondary">
          <Link to="/display-campaign" className="block px-4 py-2">Campaigns</Link>
          <Link to="/create-campaign" className="block px-4 py-2">Create Campaign</Link>
          <Link to="/profile" className="block px-4 py-2">Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
