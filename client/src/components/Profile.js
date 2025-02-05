import React from "react";
import { Link } from "react-router-dom";
import defaultImage from "../assets/demo.jpeg";

const Profile = ({ address, campaigns }) => {
  console.log(address);
  if (!address) {
    return <p className="text-gray-400 text-center mt-10">Please connect your wallet to view your profile.</p>;
  }

  // Ensure campaigns exist and have an owner property before filtering

  const userAddress = typeof address === "object" && address.address ? address.address : address;

  const userCampaigns = campaigns.filter(
    (campaign) =>
      campaign.owner && typeof campaign.owner === "string" &&
      campaign.owner.toLowerCase() === userAddress.toLowerCase()
  );
  
  return (
    <div className="max-w-6xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">My Campaigns</h2>

      {userCampaigns.length === 0 ? (
        <p className="text-gray-400">No campaigns created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCampaigns.map((campaign, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden p-4 text-blue-600">
              <Link to={`/campaign/${i}`}>
                <img
                  src={campaign.image || defaultImage}
                  alt={campaign.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => e.target.src = defaultImage}
                />
                <h3 className="text-xl font-semibold mt-2">{campaign.title}</h3>
              </Link>
              <p className="text-sm text-gray-600 mt-2">Target: {Math.round(parseFloat(campaign.target))} ETH</p>
              <p className="text-sm text-gray-600">Raised: {Math.round(parseFloat(campaign.amountCollected))} ETH</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
