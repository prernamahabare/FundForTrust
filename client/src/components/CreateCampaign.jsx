import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import money from "../assets/money.svg"

const CreateCampaign = ({ contract }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.target || !form.deadline || !form.image) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const parsedTarget = ethers.parseEther(form.target);
      const parsedDeadline = Math.floor(new Date(form.deadline).getTime() / 1000);

      // Get Ethereum provider from MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Get the connected wallet signer
      const userAddress = await signer.getAddress(); // Get user's address

      // console.log("Submitting with values:", {
      //   owner: userAddress,  // Include owner
      //   title: form.title,
      //   description: form.description,
      //   target: parsedTarget.toString(),
      //   deadline: parsedDeadline,
      //   image: form.image,
      // });

      // Connect contract with signer
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.createCampaign(
        userAddress,  // Pass the owner's address
        form.title,
        form.description,
        parsedTarget,
        parsedDeadline,
        form.image
      );
      await tx.wait();

      toast.success("Campaign created successfully!");
      navigate("/display-campaign");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Toaster />
      <div className="bg-[#1c1c24] p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-white text-2xl font-bold mb-4">Create a New Campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleChange("title", e.target.value)}
          />
          <FormField
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleChange("description", e.target.value)}
          />

          <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
            <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
            <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
          </div>
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleChange("target", e.target.value)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleChange("deadline", e.target.value)}
          />
          <FormField
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleChange("image", e.target.value)}
          />
          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton styles="bg-[#1dc071]" type="submit" title={loading ? "Creating..." : "Create Campaign"} disabled={loading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
