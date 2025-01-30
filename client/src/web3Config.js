import { BrowserProvider, Contract } from "ethers";
import contractABI from "./contractABI.json";

const contractAddress = "0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e"; // Replace with actual contract address

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

