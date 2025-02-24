import React from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import loader from "../assets/loader.svg";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign, index) => {
    if (!campaign) {
      console.error("Error: Campaign is undefined!");
      return;
    }

    const safeCampaign = {
      id: campaign.id?.toString() || index.toString(),
      title: campaign.title || "Untitled",
      owner: campaign.owner || "Unknown",
      description: campaign.description || "No description",
      amountCollected: campaign.amountCollected?.toString() || "0",
      target: campaign.target?.toString() || "0", 
      deadline: campaign.deadline?.toString() || "0",
      image: campaign.image || "",
    };

    navigate(`/campaign-details/${safeCampaign.id}`, { state: safeCampaign });
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="font-epilogue font-semibold text-[22px] text-white text-center mb-6">
        All Campaigns ({campaigns?.length || 0})
      </h1>

      {/* Increased space between cards */}
      <div className="flex flex-wrap justify-center items-center mt-[20px] gap-[50px] max-w-6xl">
        {isLoading && <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />}

        {!isLoading && campaigns?.length === 0 && (
          <p className="font-epilogue font-semibold text-[16px] leading-[30px] text-[#818183] text-center">
            No campaigns available
          </p>
        )}

        {!isLoading &&
          campaigns?.length > 0 &&
          campaigns.map((campaign, index) => (
            <FundCard key={index} campaign={campaign} handleClick={() => handleNavigate(campaign, index)} />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
