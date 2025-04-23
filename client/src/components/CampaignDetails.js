/* global BigInt */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";
import defaultImage from "../assets/demo.jpeg";
import CustomButton from "./CustomButton";
import FormField from "./FormField";

const CampaignDetails = ({ campaigns, contract }) => {
  const { id } = useParams();
  
  const [campaignData, setCampaignData] = useState(null);
  const [donors, setDonors] = useState([]);
  const [isFundingEnded, setIsFundingEnded] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaigns && campaigns[id]) {
      setCampaignData(campaigns[id]);
    }
  }, [campaigns, id]);

  useEffect(() => {
    const fetchDonors = async () => {
      if (!contract || !id || !campaignData) return;
      
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
  }, [contract, id, campaignData]);

  useEffect(() => {
    if (campaignData?.deadline) {
      const currentTime = Math.floor(Date.now() / 1000);
      setIsFundingEnded(currentTime > Number(campaignData.deadline));
    }
  }, [campaignData]);

  if (!campaignData) return <div className="text-center mt-10 text-gray-500">Campaign not found</div>;

  const goal = ethers.formatEther(campaignData.target || "0");
  const raised = ethers.formatEther(campaignData.amountCollected || "0");
  const remaining = Math.max(Number(goal) - Number(raised), 0);
  const ownerAddress = campaignData.owner || "Unknown";

  const isGoalReached = Number(raised) >= Number(goal);

  const donate = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (isGoalReached) {
      toast.success("Donation goal already reached! You cannot donate.");
      return;
    }
    if (isFundingEnded) {
      toast("The funding period has ended. Donations are no longer allowed.");
      return;
    }
    if (Number(donationAmount) > remaining) {
      toast.error(`You cannot donate more than the remaining amount (${remaining} ETH).`);
      return;
    }
  
    setLoading(true);
    try {
      const parsedAmount = ethers.parseEther(donationAmount);
      const tx = await contract.donateToCampaign(BigInt(id), { value: parsedAmount });
      await tx.wait();
  
      setCampaignData(prevData => {
        if (!prevData) return null;

        const previousAmount = BigInt(prevData.amountCollected || "0");
        const newAmount = previousAmount + BigInt(parsedAmount);
        
        return {
          ...prevData,
          amountCollected: newAmount.toString(),
          title: prevData.title || "Untitled Campaign",
          description: prevData.description || "No description available.",
          owner: prevData.owner || "Unknown",
          target: prevData.target || "0",
          deadline: prevData.deadline || "0",
          image: prevData.image || defaultImage,
        };
      });
  
      const [donatorAddresses, donationAmounts] = await contract.getDonators(Number(id));
      const updatedDonors = donatorAddresses.map((address, index) => ({
        address,
        amount: ethers.formatEther(donationAmounts[index] || "0"),
      }));
      
      setDonors(updatedDonors);
      
      toast.success("Donation successful!");
      setDonationAmount("");
  
    } catch (error) {
      console.error("Error:", error);
      toast.error("Donation failed!");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Toaster />
      <div className="bg-[#1c1c24] p-6 rounded-lg shadow-lg max-w-3xl mx-auto text-white">
        <img
          src={campaignData.image || defaultImage}
          alt={campaignData.title || "Campaign"}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => (e.target.src = defaultImage)}
        />

        <h2 className="text-2xl font-bold my-4">{campaignData.title || "Untitled Campaign"}</h2>

        <div className="text-gray-400">
          <p><strong>Owner:</strong> {typeof ownerAddress === 'string' && ownerAddress.length > 10 
            ? `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}` 
            : ownerAddress}
          </p>
          <p><strong>Goal:</strong> {goal} ETH</p>
          <p><strong>Raised:</strong> {raised} ETH</p>
        </div>

        <p className="text-gray-400 mt-4"><strong>Description:</strong> {campaignData.description || "No description available."}</p>

        {/* Goal reached field added */}

        {isGoalReached ? (
          <p className="text-green-500 font-bold mt-4">🎉 Goal Reached! No more donations needed.</p>
        ) : isFundingEnded ? (
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
