import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import { Routes, Route } from "react-router-dom"; // No BrowserRouter here
import contractABI from "./contractABI.json";
import CreateCampaign from "./components/CreateCampaign";
import DisplayCampaigns from "./components/DisplayCampaigns";
import CampaignDetails from "./components/CampaignDetails";

const contractAddress = "0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) handleAccountsChanged(accounts);
          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", () => window.location.reload());
        } catch (error) {
          console.error("Error initializing provider:", error);
        }
      } else {
        alert("Please install MetaMask to interact with this app.");
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress("");
      setSigner(null);
      setContract(null);
    } else {
      setAddress(accounts[0]);
      await connectWallet();
    }
  };

  const connectWallet = async () => {
    try {
      if (!provider) {
        alert("Please install MetaMask!");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Signer = await provider.getSigner();
      setSigner(web3Signer);

      try {
        const crowdfundingContract = new Contract(contractAddress, contractABI, web3Signer);
        setContract(crowdfundingContract);
        setIsConnected(true);
        await fetchCampaigns(crowdfundingContract);
      } catch (error) {
        console.error("Error creating contract instance:", error);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. Check console for details.");
    }
  };

  const fetchCampaigns = async (contractInstance) => {
    try {
      const allCampaigns = await contractInstance.getCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Crowdfunding Platform</h1>
          {!isConnected ? (
            <button onClick={connectWallet} className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600">
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm text-gray-600">
              Connected: {String(address).slice(0, 6)}...{String(address).slice(-4)}
            </div>
          )}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              isConnected && (
                <>
                  <CreateCampaign contract={contract} signer={signer} fetchCampaigns={fetchCampaigns} />
                  <DisplayCampaigns campaigns={campaigns} loading={false} contract={contract} />
                </>
              )
            }
          />
          <Route path="/campaign/:id" element={<CampaignDetails campaigns={campaigns} contract={contract} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
