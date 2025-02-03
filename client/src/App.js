/* global BigInt */
import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from 'ethers';
import contractABI from "./contractABI.json";
import CreateCampaign from './components/CreateCampaign';
import DisplayCampaigns from './components/DisplayCampaigns'


const contractAddress = "0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
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

  // Handle donation
  // const donate = async (id, amount) => {
  //   setLoading(true);
  //   try {
  //     // Estimate gas for donation
  //     const gasEstimate = await contract.donateToCampaign.estimateGas(id, {
  //       value: ethers.parseEther(amount)
  //     });

  //     // Add 20% buffer to gas estimate
  //     const gasLimit = gasEstimate + (gasEstimate * BigInt(20) / BigInt(100));

  //     const tx = await contract.donateToCampaign(id, {
  //       value: ethers.parseEther(amount),
  //       gasLimit: gasLimit,
  //       maxFeePerGas: ethers.parseUnits("50", "gwei"),
  //       maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
  //     });

  //     await tx.wait();

  //     // Refresh campaigns
  //     await fetchCampaigns(contract);

  //     alert("Donation successful!");
  //   } catch (error) {
  //     console.error("Error making donation:", error);
  //     alert("Error donating. Check console for details.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Format remaining time
  // const getRemainingTime = (deadline) => {
  //   const now = new Date().getTime();
  //   const deadlineTime = deadline * 1000; // Convert to milliseconds
  //   const remaining = deadlineTime - now;

  //   if (remaining <= 0) return "Ended";

  //   const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  //   const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  //   return `${days}d ${hours}h remaining`;
  // };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white p-4">
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
          <div className="flex-1 p-4">
            {isConnected && (
              <>
                <CreateCampaign
                  contract={contract}
                  signer={signer}
                  fetchCampaigns={fetchCampaigns}
                />

                <DisplayCampaigns
                  campaigns={campaigns}
                  loading={loading}
                  contract={contract}
                  fetchCampaigns={fetchCampaigns}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;