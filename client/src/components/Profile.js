import React from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import loader from "../assets/loader.svg";
import defaultImage from "../assets/demo.jpeg";

const Profile = ({ address, campaigns }) => {
  const navigate = useNavigate();

  if (!address) {
    return <p className="text-gray-400 text-center mt-10">Please connect your wallet to view your profile.</p>;
  }

  const userAddress = typeof address === "object" && address.address ? address.address : address;

  const userCampaigns = campaigns.filter(
    (campaign) =>
      campaign.owner &&
      typeof campaign.owner === "string" &&
      campaign.owner.toLowerCase() === userAddress.toLowerCase()
  );

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
      image: campaign.image || defaultImage,
    };

    navigate(`/campaign-details/${safeCampaign.id}`, { state: safeCampaign });
  };

  return (
    <div className="p-6 flex flex-col items-center">

      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        My Campaigns ({userCampaigns.length})
      </h1>

      <div className="flex flex-wrap justify-center items-center mt-[20px] gap-[50px] max-w-6xl">
        {userCampaigns.length === 0 ? (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns created yet.
          </p>
        ) : (
          userCampaigns.map((campaign, index) => (
            <FundCard
              key={index}
              campaign={campaign}
              handleClick={() => handleNavigate(campaign, index)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
