/* global BigInt */
import React, { useState } from 'react';
import { ethers } from 'ethers';

const CreateCampaign = ({ contract, signer, fetchCampaigns }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.target || !formData.deadline || !formData.image) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Estimate gas before sending transaction
      const gasEstimate = await contract.createCampaign.estimateGas(
        await signer.getAddress(),
        formData.title,
        formData.description,
        ethers.parseEther(formData.target),
        new Date(formData.deadline).getTime() / 1000,
        formData.image
      );

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate + (gasEstimate * BigInt(20) / BigInt(100));

      const tx = await contract.createCampaign(
        await signer.getAddress(),
        formData.title,
        formData.description,
        ethers.parseEther(formData.target),
        new Date(formData.deadline).getTime() / 1000,
        formData.image,
        {
          gasLimit: gasLimit,
          maxFeePerGas: ethers.parseUnits("50", "gwei"),
          maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
        }
      );

      await tx.wait();

      // Reset form
      setFormData({
        title: '',
        description: '',
        target: '',
        deadline: '',
        image: ''
      });

      // Refresh campaigns list
      await fetchCampaigns(contract);
      
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter campaign title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your campaign"
          />
        </div>

        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount (ETH)
          </label>
          <input
            id="target"
            name="target"
            type="number"
            step="0.01"
            value={formData.target}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-md hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#0d2d5c] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;