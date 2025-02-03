/* global BigInt */
import React, { useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import defaultImage from "../assets/demo.jpeg";

const DisplayCampaigns = ({ campaigns, loading, contract, fetchCampaigns }) => {
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationAmounts, setDonationAmounts] = useState({});

  const getRemainingTime = (deadline) => {
    const now = new Date().getTime();
    const deadlineTime = deadline * 1000;
    const remaining = deadlineTime - now;
    if (remaining <= 0) return "Ended";
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h remaining`;
  };

  const donate = async (campaignId, donationAmount) => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setDonationLoading(true);
    try {
      const parsedAmount = ethers.parseEther(donationAmount);
      const tx = await contract.donateToCampaign(BigInt(campaignId), { value: parsedAmount });
      await tx.wait();
      alert("Donation successful!");
      fetchCampaigns(); // Refresh the campaigns to reflect updated amount raised
    } catch (error) {
      console.error("Error:", error);
      alert("Donation failed!");
    }
    setDonationLoading(false);
  };

  if (campaigns.length === 0) {
    return <div className="text-center text-gray-500 mt-8">No campaigns available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, i) => {
        const raised = Number(ethers.formatEther(campaign.amountCollected));
        const target = Number(ethers.formatEther(campaign.target));
        const isTargetAchieved = raised >= target;
        const deadlinePassed = Number(campaign.deadline) * 1000 < Date.now();

        return (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden p-4 text-blue-600">
            <Link to={`/campaign/${i}`}>
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
              </div>
            </Link>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${Math.min((raised / target) * 100, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Raised: {raised.toFixed(4)} ETH</span>
              <span>Goal: {target.toFixed(4)} ETH</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>{getRemainingTime(Number(campaign.deadline))}</span>
              <span>
                {String(campaign.owner).slice(0, 6)}...{String(campaign.owner).slice(-4)}
              </span>
            </div>

            {isTargetAchieved && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center">
                🎉 Target Achieved!
              </div>
            )}
            {deadlinePassed && !isTargetAchieved && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center">
                ⏳ Funding Period Ended
              </div>
            )}

            {/* Donate Button */}
            {!isTargetAchieved && !deadlinePassed && (
              <div className="mt-4">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="ETH amount"
                  onChange={(e) => setDonationAmounts({ ...donationAmounts, [i]: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  onClick={() => donate(i, donationAmounts[i])}
                  disabled={donationLoading}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  {donationLoading ? "Processing..." : "Donate"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DisplayCampaigns;
