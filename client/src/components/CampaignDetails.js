/* global BigInt */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import defaultImage from "../assets/demo.jpeg";

const CampaignDetails = ({ campaigns, contract }) => {
  const { id } = useParams();
  const campaign = campaigns[id];

  const [donors, setDonors] = useState([]);
  const [isFundingEnded, setIsFundingEnded] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaign) return;

    const fetchDonors = async () => {
      try {
        const [donatorAddresses, donationAmounts] = await contract.getDonators(Number(id));

        const donorList = donatorAddresses.map((address, index) => ({
          address,
          amount: ethers.formatEther(donationAmounts[index] || "0"),
        }));

        setDonors(donorList);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchDonors();
  }, [contract, id]);

  useEffect(() => {
    if (campaign?.deadline) {
      const currentTime = Math.floor(Date.now() / 1000);
      setIsFundingEnded(currentTime > Number(campaign.deadline));
    }
  }, [campaign]);

  if (!campaign) return <div className="text-center mt-10 text-gray-500">Campaign not found</div>;

  // ✅ Fix: Use `target` instead of `goal`
  const goal = ethers.formatEther(campaign.target || "0");
  const raised = ethers.formatEther(campaign.amountCollected || "0");
  const remaining = Math.max(goal - raised, 0); // ✅ Ensure it doesn't go negative

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
      
      // ✅ Reset the input field
      setDonationAmount("");
  
      // ✅ Fetch updated donors list without refreshing
      const [donatorAddresses, donationAmounts] = await contract.getDonators(Number(id));
      const updatedDonors = donatorAddresses.map((address, index) => ({
        address,
        amount: ethers.formatEther(donationAmounts[index] || "0"),
      }));
  
      setDonors(updatedDonors); // ✅ Update the donors list dynamically
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

      <div className="text-gray-600">
        <p><strong>Owner:</strong> {String(campaign.owner).slice(0, 6)}...{String(campaign.owner).slice(-4)}</p>
        <p><strong>Goal:</strong> {goal} ETH</p>
        <p><strong>Raised:</strong> {raised} ETH</p>
      </div>

      <p className="text-gray-600 mt-4"><strong>Description:</strong> {campaign.description || "No description available."}</p>

      {isFundingEnded ? (
        <p className="text-red-600 font-bold mt-4">⚠️ The funding period has ended.</p>
      ) : (
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
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Donors</h3>
        {donors.length > 0 ? (
          <ul className="mt-2">
            {donors.map((donor, index) => (
              <li key={index} className="text-gray-700">
                {donor.address} donated <strong>{donor.amount} ETH</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No donations yet.</p>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
