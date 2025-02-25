/* global BigInt */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const Settings = ({ address, contract }) => {
    const [totalRaised, setTotalRaised] = useState("0.0000");

    useEffect(() => {
        const fetchTotalRaised = async () => {
            if (!contract) return;

            try {
                const campaigns = await contract.getCampaigns();
                if (!campaigns || campaigns.length === 0) {
                    setTotalRaised("0.0000");
                    return;
                }

                const totalWei = campaigns.reduce((sum, campaign) => sum + BigInt(campaign.amountCollected), BigInt(0));
                const totalEth = ethers.formatEther(totalWei);
                setTotalRaised(parseFloat(totalEth).toFixed(4));

            } catch (error) {
                console.error("Error fetching total amount raised:", error);
            }
        };

        fetchTotalRaised();
    }, [contract]);

    // ✅ Extract the address string correctly
    const walletAddress = typeof address === "object" && address.address ? address.address : address || "Not connected";

    return (
        <div className="p-6">
            <div className="p-6 bg-[#1c1c24] text-white rounded-lg shadow-lg max-w-xl mx-auto">
                <h2 className="text-xl font-bold text-center mb-4">Settings</h2>
                <p><strong>Wallet Address:</strong> {walletAddress}</p>
                
                <div className="mt-4">
                    <p><strong>Total Raised Amount:</strong> {totalRaised} ETH</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
