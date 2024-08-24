import React, { useState } from 'react';
import { ethers } from 'ethers';

function WalletConnector() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum); 
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(); 
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
      <div className="p-8 bg-white rounded-lg shadow-2xl text-center text-gray-900">
        <h1 className="text-4xl font-bold mb-6">Crypto Wallet Connector</h1>
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-lg">Wallet Address:</p>
            <p className="text-xl font-semibold">{walletAddress}</p>
            <p className="text-lg mt-4">Balance:</p>
            <p className="text-2xl font-bold mt-1">{balance} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletConnector;
