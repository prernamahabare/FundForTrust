/* global BigInt */
import React, { useState } from "react";
import { ethers } from "ethers";
import defaultImage from "../assets/demo.jpeg";

const DisplayCampaigns = ({ campaigns, loading, contract, fetchCampaigns }) => {
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationAmounts, setDonationAmounts] = useState({}); // Store user input for each campaign

  // Format remaining time
  const getRemainingTime = (deadline) => {
    const now = new Date().getTime();
    const deadlineTime = deadline * 1000; // Convert to milliseconds
    const remaining = deadlineTime - now;

    if (remaining <= 0) return "Ended";

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  // Handle donation
  const donate = async (id) => {
    const amount = donationAmounts[id]; // Get the amount entered for this campaign

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    setDonationLoading(true);
    try {
      console.log("Donating to Campaign ID:", id);
      console.log("Donation Amount:", amount);

      const parsedAmount = ethers.parseEther(amount); // Convert ETH to Wei
      console.log("Parsed Amount (in Wei):", parsedAmount.toString());

      const tx = await contract.donateToCampaign(BigInt(id), {
        value: parsedAmount,
        gasLimit: ethers.parseUnits("500000", "wei"), // Set a fixed gas limit
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
      });

      await tx.wait();

      // Refresh campaigns
      await fetchCampaigns(contract);
      alert("Donation successful!");
      
    } catch (error) {
      console.error("Error making donation:", error);
      alert("Error donating. Check console for details.");
    } finally {
      setDonationLoading(false);
    }
  };

  // Handle input change
  const handleAmountChange = (campaignId, value) => {
    setDonationAmounts((prev) => ({
      ...prev,
      [campaignId]: value,
    }));
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

        return (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden p-4">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />

            <h3 className="text-xl text-gray-800 font-semibold mb-2">{campaign.title}</h3>
            <p className="text-gray-600 mb-4">{campaign.description}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.min((raised / target) * 100, 100)}%`,
                }}
              ></div>
            </div>

            {/* Campaign Stats */}
            <div className="flex justify-between text-sm text-gray-800 mt-2">
              <span>Raised: {raised} ETH</span>
              <span>Target: {target} ETH</span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
              <span>{getRemainingTime(Number(campaign.deadline))}</span>
              <span>
                By: {String(campaign.owner).slice(0, 6)}...
                {String(campaign.owner).slice(-4)}
              </span>
            </div>

            {/* Input field for donation amount */}
            {!isTargetAchieved && (
              <>
                <input
                  type="number"
                  placeholder="Enter amount (ETH)"
                  value={donationAmounts[i] || ""}
                  onChange={(e) => handleAmountChange(i, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-blue-600 rounded-md mt-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                />

                <button
                  onClick={() => donate(i)}
                  disabled={donationLoading || Number(campaign.deadline) * 1000 < Date.now()}
                  className="w-full bg-[#1e3a8a] text-white px-4 py-2 rounded-md hover:bg-[#1e40af] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d2d5c] focus:ring-offset-2 mt-2"
                >
                  {donationLoading ? "Processing..." : "Donate"}
                </button>
              </>
            )}

            {/* Show "Target Achieved" instead of Donate Button if goal is met */}
            {isTargetAchieved && (
              <div className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-center mt-2">
                🎉 Target Achieved!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DisplayCampaigns;
