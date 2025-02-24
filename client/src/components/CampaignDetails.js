/* global BigInt */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import defaultImage from "../assets/demo.jpeg";
import CustomButton from "./CustomButton";
import FormField from "./FormField";

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

  const goal = ethers.formatEther(campaign.target || "0");
  const raised = ethers.formatEther(campaign.amountCollected || "0");
  const remaining = Math.max(goal - raised, 0);

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
      setDonationAmount("");

      const [donatorAddresses, donationAmounts] = await contract.getDonators(Number(id));
      const updatedDonors = donatorAddresses.map((address, index) => ({
        address,
        amount: ethers.formatEther(donationAmounts[index] || "0"),
      }));

      setDonors(updatedDonors);
    } catch (error) {
      console.error("Error:", error);
      alert("Donation failed!");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="bg-[#1c1c24] p-6 rounded-lg shadow-lg max-w-3xl mx-auto text-white">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => (e.target.src = defaultImage)}
        />

        <h2 className="text-2xl font-bold my-4">{campaign.title}</h2>

        <div className="text-gray-400">
          <p><strong>Owner:</strong> {String(campaign.owner).slice(0, 6)}...{String(campaign.owner).slice(-4)}</p>
          <p><strong>Goal:</strong> {goal} ETH</p>
          <p><strong>Raised:</strong> {raised} ETH</p>
        </div>

        <p className="text-gray-400 mt-4"><strong>Description:</strong> {campaign.description || "No description available."}</p>

        {isFundingEnded ? (
          <p className="text-red-500 font-bold mt-4">⚠️ The funding period has ended.</p>
        ) : (
          <>
            <div className="my-5">

              <FormField
                placeholder="Enter ETH amount to donate"
                inputType="text"
                value={donationAmount}
                handleChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>

            <div className="flex justify-center items-center mt-[20px]">
              <CustomButton styles="bg-[#1dc071]" handleClick={donate} title={loading ? "Processing..." : "Donate"} disabled={loading} />
            </div>
          </>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Donors</h3>
          {donors.length > 0 ? (
            <ul className="mt-2">
              {donors.map((donor, index) => (
                <li key={index} className="text-gray-400">
                  {donor.address} donated <strong>{donor.amount} ETH</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No donations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
