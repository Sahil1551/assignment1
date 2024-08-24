import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import {
    ConnectionProvider,
    WalletProvider,
    useWallet
} from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

function CoinFlipGame() {
    const [balance, setBalance] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [selectedSide, setSelectedSide] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [betError, setBetError] = useState('');
    const { publicKey, connected } = useWallet();

    useEffect(() => {
        const fetchBalance = async () => {
            if (publicKey) {
                try {
                    const connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet));
                    const balance = await connection.getBalance(publicKey);
                    setBalance(balance / 1e9); // Convert from lamports to SOL
                } catch (err) {
                    console.error("Error fetching balance:", err);
                    setError('Failed to fetch balance.');
                    setBalance(null);
                }
            }
        };
        if (connected) {
            fetchBalance();
        }
    }, [publicKey, connected]);

    const flipCoin = () => {
        if (!connected || !betAmount || !selectedSide) {
            alert('Please connect your wallet, enter an amount, and select a side.');
            return;
        }

        // Convert betAmount to number
        const betAmountNumber = parseFloat(betAmount);

        if (isNaN(betAmountNumber) || betAmountNumber <= 0) {
            setBetError('Please enter a valid bet amount.');
            return;
        }

        if (betAmountNumber > balance) {
            setBetError('Insufficient balance.');
            return;
        }

        // Clear any previous bet errors
        setBetError('');

        const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(flipResult);

        if (flipResult === selectedSide) {
            alert(`You won! You doubled your bet of ${betAmount} SOL.`);
            setBalance(balance + betAmountNumber); // Update balance on win
        } else {
            alert(`You lost! Better luck next time.`);
            setBalance(balance - betAmountNumber); // Update balance on loss
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <h1 className="text-4xl font-bold mb-6">Solana Coin Flip Game</h1>
            {!connected ? (
                <WalletMultiButton className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300" />
            ) : (
                <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-96">
                    <p className="text-xl font-semibold">Wallet: {publicKey.toString()}</p>
                    <p className="text-lg mb-4">
                        Balance: {balance === null ? 'Loading...' : `${balance.toFixed(2)} SOL`}
                        {error && <span className="text-red-500 ml-2">{error}</span>}
                    </p>
                    <div className="mt-4">
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            placeholder="Enter amount in SOL"
                            className="w-full p-2 border rounded mb-4"
                        />
                        {betError && <p className="text-red-500 mb-4">{betError}</p>}
                        <div className="flex justify-around mb-4">
                            <button
                                onClick={() => setSelectedSide('heads')}
                                className={`px-6 py-3 rounded ${selectedSide === 'heads' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                Heads
                            </button>
                            <button
                                onClick={() => setSelectedSide('tails')}
                                className={`px-6 py-3 rounded ${selectedSide === 'tails' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                Tails
                            </button>
                        </div>
                        <button
                            onClick={flipCoin}
                            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition duration-300"
                        >
                            Flip Coin
                        </button>
                        {result && (
                            <div className="mt-4 text-center text-xl">
                                <p>The coin landed on: <span className="font-bold">{result}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    const wallets = [new PhantomWalletAdapter()];

    return (
        <ConnectionProvider endpoint={clusterApiUrl(WalletAdapterNetwork.Devnet)}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <CoinFlipGame />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
