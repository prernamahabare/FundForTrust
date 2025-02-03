/* global BigInt */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import defaultImage from "../assets/demo.jpeg";

const CampaignDetails = ({ campaigns, contract }) => {
  const { id } = useParams();
  const campaign = campaigns[id];
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFundingEnded, setIsFundingEnded] = useState(false);

  useEffect(() => {
    // Check if the campaign funding period has ended
    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    if (campaign && campaign.deadline) {
      setIsFundingEnded(currentTime > Number(campaign.deadline));
    }
  }, [campaign]);

  if (!campaign) return <div className="text-center mt-10 text-gray-500">Campaign not found</div>;

  const goal = ethers.formatEther(campaign.target);
  const raised = ethers.formatEther(campaign.amountCollected);
  const remaining = goal - raised;

  const donate = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (Number(raised) >= Number(goal)) {
      alert("Donation goal already reached! You cannot donate.");
      return;
    }

    if (isFundingEnded) {
      alert("The funding period has ended. Donations are no longer allowed.");
      return;
    }

    if (Number(donationAmount) > remaining) {
      alert(`You cannot donate more than the remaining amount (${remaining} ETH).`);
      return;
    }

    setLoading(true);
    try {
      const parsedAmount = ethers.parseEther(donationAmount);
      const tx = await contract.donateToCampaign(BigInt(id), { value: parsedAmount });
      await tx.wait();
      alert("Donation successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Donation failed!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-64 object-cover rounded-lg"
        onError={(e) => (e.target.src = defaultImage)}
      />
      <h2 className="text-2xl font-bold my-4">{campaign.title}</h2>
      <p className="text-gray-600"><strong>Owner:</strong> {String(campaign.owner).slice(0, 6)}...{String(campaign.owner).slice(-4)}</p>
      <p className="text-gray-600"><strong>Goal:</strong> {goal} ETH</p>
      <p className="text-gray-600"><strong>Raised:</strong> {raised} ETH</p>
      <p className="text-gray-600"><strong>Remaining:</strong> {remaining} ETH</p>
      <p className="text-gray-600 mt-4"><strong>Description:</strong> {campaign.description || "No description available."}</p>

      {isFundingEnded ? (
        <p className="text-red-600 font-bold mt-4">⚠️ The funding period has ended. No further donations allowed.</p>
      ) : Number(raised) < Number(goal) ? (
        <>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="ETH amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full p-2 border rounded my-3"
          />
          <button
            onClick={donate}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </>
      ) : (
        <p className="text-green-600 font-bold mt-4">🎉 Goal reached! No further donations needed.</p>
      )}
    </div>
  );
};

export default CampaignDetails;
