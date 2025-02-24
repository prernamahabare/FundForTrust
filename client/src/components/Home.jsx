import React from "react";
import Footer from "./Footer";
// import heroImage from "../assets/image.png";
import ImageLayout from "./ImageLayout";

const Home = ({ isConnected, connectWallet }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
          {/* Text Section */}
          <div className="flex-1 text-center md:text-left px-6">
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
          {/* Image Section */}
          <div className="flex flex-1 justify-center items-center">
            <ImageLayout alt="Crowdfunding Illustration"
              className="mx-auto max-w-sm"/>
            {/* <img
              src={heroImage}
              alt="Crowdfunding Illustration"
              className="mx-auto max-w-sm"
            /> */}

          </div>
        </div>

        {/* Footer */}
      </div>
      <Footer />
    </>
  );
};

export default Home;
