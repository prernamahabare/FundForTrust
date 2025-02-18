import React from "react";
import { FaFacebook, FaDiscord, FaTwitter, FaGithub, FaDribbble } from "react-icons/fa";
// Import a placeholder image or your actual image
import heroImage from "../assets/demo.jpeg"; // Update this path to match your actual image location

const socialIcons = {
  facebook: <FaFacebook className="w-5 h-5 hover:text-blue-500" />,
  discord: <FaDiscord className="w-5 h-5 hover:text-purple-500" />,
  twitter: <FaTwitter className="w-5 h-5 hover:text-blue-400" />,
  github: <FaGithub className="w-5 h-5 hover:text-gray-400" />,
  dribbble: <FaDribbble className="w-5 h-5 hover:text-pink-500" />,
};

const Home = ({ isConnected, connectWallet }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
  <div className="flex-grow flex items-center justify-center py-12">
  <div className="flex flex-col md:flex-row items-center justify-center w-full">
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-4xl font-bold mb-4">
        Empower dreams, fund the future – your support makes ideas a reality!
      </h2>
      {!isConnected && (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
    <div className="flex flex-1 justify-center items-center">
      <img 
        src={heroImage} 
        alt="Crowdfunding Illustration" 
       className=" mx-auto m-40 ml-10 mt-20"
      />
    </div>
  </div>
</div>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-gray-900 mt-auto">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="/" className="flex items-center">
                <img
                  src="/api/placeholder/32/32"
                  className="h-8 me-3"
                  alt="CrowdFunding Logo"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  CrowdFunding
                </span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Resources",
                  links: [
                    { name: "CrowdFunding", href: "/" },
                    { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
                  ],
                },
                {
                  title: "Follow us",
                  links: [
                    { name: "Github", href: "#" },
                    { name: "Discord", href: "#" },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { name: "Privacy Policy", href: "#" },
                    { name: "Terms & Conditions", href: "#" },
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                    {section.title}
                  </h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    {section.links.map((link) => (
                      <li key={link.name} className="mb-4">
                        <a href={link.href} className="hover:underline">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {new Date().getFullYear()}{" "}
              <a href="/" className="hover:underline">
                CrowdFunding™
              </a>
              . All Rights Reserved.
            </span>
            {/* Social Icons */}
            <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
              {Object.entries(socialIcons).map(([platform, icon]) => (
                <a
                  key={platform}
                  href="#"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;