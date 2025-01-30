/* global BigInt */
import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from 'ethers';
import contractABI from "./contractABI.json";
import Sidebar from './components/Sidebar';

const contractAddress = "0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  // Initialize web3 provider
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            handleAccountsChanged(accounts);
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged);

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error initializing provider:", error);
        }
      } else {
        alert("Please install MetaMask to interact with this app.");
      }
    };

    initProvider();

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setIsConnected(false);
      setAddress("");
      setSigner(null);
      setContract(null);
    } else {
      // User connected/changed account
      const newAddress = accounts[0];
      setAddress(newAddress);
      await connectWallet();
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!provider) {
        alert("Please install MetaMask!");
        return;
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Signer = await provider.getSigner();
      setSigner(web3Signer);

      // Create contract instance
      try {
        const crowdfundingContract = new Contract(
          contractAddress,
          contractABI,
          web3Signer
        );

        setContract(crowdfundingContract);
        setIsConnected(true);

        // Fetch campaigns
        await fetchCampaigns(crowdfundingContract);
      } catch (error) {
        console.error("Error creating contract instance:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. Check console for details.");
    }
  };

  // Fetch campaigns
  const fetchCampaigns = async (contractInstance) => {
    try {
      const allCampaigns = await contractInstance.getCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  // Handle campaign creation
  const createCampaign = async () => {
    const { title, description, target, deadline, image } = form;

    if (!title || !description || !target || !deadline || !image) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Estimate gas before sending transaction
      const gasEstimate = await contract.createCampaign.estimateGas(
        await signer.getAddress(),
        title,
        description,
        ethers.parseEther(target),
        new Date(deadline).getTime() / 1000,
        image
      );

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate + (gasEstimate * BigInt(20) / BigInt(100));

      const tx = await contract.createCampaign(
        await signer.getAddress(),
        title,
        description,
        ethers.parseEther(target),
        new Date(deadline).getTime() / 1000,
        image,
        {
          gasLimit: gasLimit,
          maxFeePerGas: ethers.parseUnits("50", "gwei"),
          maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
        }
      );

      await tx.wait();

      // Reset form
      setForm({
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: ""
      });

      // Refresh campaigns
      await fetchCampaigns(contract);

      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle donation
  const donate = async (id, amount) => {
    setLoading(true);
    try {
      // Estimate gas for donation
      const gasEstimate = await contract.donateToCampaign.estimateGas(id, {
        value: ethers.parseEther(amount)
      });

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate + (gasEstimate * BigInt(20) / BigInt(100));

      const tx = await contract.donateToCampaign(id, {
        value: ethers.parseEther(amount),
        gasLimit: gasLimit,
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
      });

      await tx.wait();

      // Refresh campaigns
      await fetchCampaigns(contract);

      alert("Donation successful!");
    } catch (error) {
      console.error("Error making donation:", error);
      alert("Error donating. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Crowdfunding Platform</h1>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm text-gray-600">
              Connected: {String(address).slice(0, 6)}...{String(address).slice(-4)}
            </div>
          )}
        </header>

        <div className="flex">
          <Sidebar />  {/* Sidebar on the left */}
          <div className="flex-1 p-4"> {/* Main content area */}
            {/* Existing App content here */}


            {isConnected && (
              <>
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      value={form.title}
                      placeholder="Campaign Title"
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <textarea
                      value={form.description}
                      placeholder="Campaign Description"
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="border p-2 rounded"
                      rows="3"
                    />
                    <input
                      value={form.target}
                      placeholder="Target Amount (ETH)"
                      type="number"
                      step="0.01"
                      onChange={(e) => setForm({ ...form, target: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <input
                      value={form.deadline}
                      type="date"
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <input
                      value={form.image}
                      placeholder="Campaign Image URL"
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="border p-2 rounded"
                    />
                    <button
                      onClick={createCampaign}
                      disabled={loading}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                    >
                      {loading ? "Creating..." : "Create Campaign"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign, i) => (
                    <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                        }}
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                        <p className="text-gray-600 mb-4">{campaign.description}</p>
                        <div className="space-y-2">
                          <p className="text-sm">
                            Target: {ethers.formatEther(campaign.target)} ETH
                          </p>
                          <p className="text-sm">
                            Raised: {ethers.formatEther(campaign.amountCollected)} ETH
                          </p>
                          <p className="text-sm">
                            {getRemainingTime(Number(campaign.deadline))}
                          </p>
                          <button
                            onClick={() => donate(i, "0.1")}
                            disabled={loading || Number(campaign.deadline) * 1000 < Date.now()}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                          >
                            {loading ? "Processing..." : "Donate 0.1 ETH"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {campaigns.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    No campaigns available
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
