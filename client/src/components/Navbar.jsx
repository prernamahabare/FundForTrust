import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ connectWallet, address, isConnected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    await connectWallet();
    navigate("/display-campaign");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Sidebar Toggle for Mobile */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-white md:hidden">
            <FiMenu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
            <span className="ml-2 text-2xl font-semibold dark:text-white">CrowdFunding</span>
          </Link>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {!isConnected ? (
              <button
                onClick={handleConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <Link
                  to="/create-campaign"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg transition"
                >
                  Create Campaign
                </Link>
                <Link to="/profile" className="text-gray-700 dark:text-white text-2xl">
                  <FaUserCircle />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 text-white py-2 absolute top-16 w-full left-0 shadow-lg">
          <Link to="/display-campaign" className="block px-4 py-2">Campaigns</Link>
          <Link to="/create-campaign" className="block px-4 py-2">Create Campaign</Link>
          <Link to="/profile" className="block px-4 py-2">Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;