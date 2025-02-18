import { BrowserProvider, Contract } from "ethers";
import contractABI from "./contractABI.json";

const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with actual contract address

const getEthereumContract = async () => {
    if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return new Contract(contractAddress, contractABI.abi, signer);
    } else {
        alert("Please install MetaMask!");
        return null;
    }
};

export default getEthereumContract;

