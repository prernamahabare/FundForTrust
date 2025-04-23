import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import toast, { Toaster } from 'react-hot-toast';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import contractABI from "./contractABI.json";
import CreateCampaign from "./components/CreateCampaign";
import DisplayCampaigns from "./components/DisplayCampaigns";
import CampaignDetails from "./components/CampaignDetails";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Loader from "./components/Loader";
import Sidebar from "./components/Sidebar";
import Settings from "./components/Setting";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS.replace(/['"]/g, '').trim();

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initProvider = async () => {
      setInitialLoading(true);
      if (window.ethereum) {
        try {
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            await handleAccountsChanged(accounts);
          }

          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error initializing provider:", error);
        }
      }
      setInitialLoading(false);
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (contract) {
      fetchCampaigns(contract);
    }
  }, [contract, location.pathname]);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress("");
      setSigner(null);
      setContract(null);
    } else {
      setAddress(accounts[0]);
      await connectWallet(false);
    }
  };

  const connectWallet = async (shouldNavigate = true) => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask!");
        return;
      }

      const web3Provider = new BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Signer = await web3Provider.getSigner();
      setSigner(web3Signer);

      const crowdfundingContract = new Contract(contractAddress, contractABI, web3Signer);
      setContract(crowdfundingContract);
      setIsConnected(true);

      await fetchCampaigns(crowdfundingContract);
     
      if (shouldNavigate && location.pathname !== "/") {
        navigate("/display-campaign");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet. Check console for details.");
    }
    setLoading(false);
  };

  const fetchCampaigns = async (contractInstance) => {
    setLoading(true);
    try {
      const allCampaigns = await contractInstance.getCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a192f] text-white flex">
      <Toaster />
      
      {isConnected && location.pathname !== "/" && <Sidebar />}
      <div className={`flex-1 ${isConnected && location.pathname !== "/" ? "ml-[76px]" : ""}`}>
        <Navbar connectWallet={connectWallet} address={address} isConnected={isConnected} />

        {/* <div className="max-w-6xl mx-auto mt-16"> */}
        <div className=" mx-auto mt-16">
          {loading ? (
            <div className="flex bg-[#0a192f] items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home isConnected={isConnected} connectWallet={() => connectWallet(false)} />} />
              <Route path="/display-campaign" element={isConnected ? <DisplayCampaigns campaigns={campaigns} loading={loading} contract={contract} fetchCampaigns={fetchCampaigns} /> : <p className="text-center text-gray-400 mt-10">Please connect your wallet to view and create campaigns.</p>} />
              <Route path="/create-campaign" element={isConnected ? <CreateCampaign contract={contract} signer={signer} fetchCampaigns={fetchCampaigns} /> : <p className="text-center text-gray-400 mt-10">Please connect your wallet to create a campaign.</p>} />
              <Route path="/campaign-details/:id" element={<CampaignDetails campaigns={campaigns} contract={contract} />} />
              <Route path="/profile" element={<Profile address={address} campaigns={campaigns} />} />
              <Route
                path="/settings"
                element={<Settings address={address} contract={contract} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}

export default App;