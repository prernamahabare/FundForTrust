import React from "react";
import { ethers } from "ethers";
import defaultImage from "../assets/demo.jpeg";

const formatETH = (value) => {
  const num = Number(ethers.formatEther(value || "0"));
  if (num >= 1) return num.toFixed(2) + " ETH"; // Show 2 decimal places for ETH >= 1
  if (num >= 0.001) return num.toFixed(3) + " ETH"; // Show 3 decimal places for ETH >= 0.001
  return num.toFixed(6) + " ETH"; // Show up to 6 decimals for tiny amounts
};

const FundCard = ({ campaign, handleClick }) => {
  if (!campaign || typeof campaign !== "object") {
    return <div className="text-white text-center">Invalid Campaign Data</div>;
  }

  const raised = formatETH(campaign.amountCollected);
  const target = formatETH(campaign.target);

  // ✅ Calculate remaining days
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const deadlineTime = Number(campaign.deadline) || 0;
  const daysLeft = Math.max(0, Math.ceil((deadlineTime - currentTime) / (24 * 60 * 60))); // Convert seconds to days

  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer hover:shadow-lg transition-all"
      onClick={() => handleClick(campaign)}
    >
      <img
        src={campaign.image || defaultImage}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
        onError={(e) => (e.target.src = defaultImage)}
      />

      <div className="flex flex-col p-4">
        <h3 className="font-epilogue font-semibold text-[16px] text-white leading-[26px] truncate">
          {campaign.title || "No Title"}
        </h3>
        <p className="mt-[5px] font-epilogue font-normal text-[#808191] leading-[18px] truncate">
          {campaign.description || "No Description Available"}
        </p>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {raised}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] text-[#808191] truncate">
              Raised of {target}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] leading-[22px] ${daysLeft <= 3 && daysLeft != 0 ? "text-[#bf5454]" : "text-[#b2b3bd]"
              }`}>
              {daysLeft}
              {daysLeft <= 3 ? "Day" : "Days"}
            </h4>
          <p className="mt-[3px] font-epilogue font-normal text-[12px] text-[#808191] truncate">
            Left
          </p>
        </div>
      </div>

      <div className="flex items-center mt-[20px] gap-[12px]">
        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
          <span className="text-white text-xs">🧑‍💻</span>
        </div>
        <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
          by{" "}
          <span className="text-[#b2b3bd]">
            {campaign.owner
              ? `${String(campaign.owner).slice(0, 6)}...${String(campaign.owner).slice(-4)}`
              : "Unknown"}
          </span>
        </p>
      </div>
    </div>
    </div >
  );
};

export default FundCard;
