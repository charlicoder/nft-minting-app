import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Wallet, Loader2, ImagePlus, LogOut, AlertCircle, Image } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { useNFTContract, NFT } from './hooks/useNFTContract';
import { ethers } from 'ethers';

function App() {
  const { address, connectWallet, disconnectWallet } = useWallet();
  const { mintNFT, getNFTs, isLoading, error: contractError } = useNFTContract();
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('');
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  // Show contract errors
  useEffect(() => {
    if (contractError) {
      toast.error(contractError);
    }
  }, [contractError]);

  // Load NFTs when provider is available
  useEffect(() => {
    const loadNFTs = async () => {
      if (provider) {
        try {
          const loadedNFTs = await getNFTs(provider);
          setNfts(loadedNFTs);
        } catch (err: any) {
          toast.error('Failed to load NFTs');
        }
      }
    };
    loadNFTs();
  }, [provider, getNFTs]);

  const handleConnect = async () => {
    try {
      const provider = await connectWallet();
      setProvider(provider);
      toast.success('Wallet connected successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setProvider(null);
    setTransactionHash(null);
    setNfts([]);
    toast.success('Wallet disconnected successfully!');
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const hash = await mintNFT(provider, uri, title);
      setTransactionHash(hash);
      toast.success('NFT minted successfully!');
      
      // Refresh NFT list
      const loadedNFTs = await getNFTs(provider);
      setNfts(loadedNFTs);
      
      setTitle('');
      setUri('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to mint NFT');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <ImagePlus size={32} className="text-purple-400" />
            <h1 className="text-3xl font-bold">NFT Minter</h1>
          </div>
          
          {address ? (
            <div className="flex items-center space-x-4">
              <span className="text-purple-300">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
              <button
                onClick={handleDisconnect}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Wallet size={20} />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Mint Your NFT</h2>
            
            {!address && (
              <div className="mb-6 p-4 bg-yellow-500/20 rounded-lg flex items-center space-x-2">
                <AlertCircle className="text-yellow-500" />
                <p>Please connect your wallet to mint NFTs</p>
              </div>
            )}
            
            <form onSubmit={handleMint} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">NFT Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter NFT title"
                  required
                  disabled={!address || isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URI</label>
                <input
                  type="text"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter URI for your NFT"
                  required
                  disabled={!address || isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !address}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={20} />
                    <span>Mint NFT</span>
                  </>
                )}
              </button>
            </form>

            {transactionHash && (
              <div className="mt-6 p-4 bg-green-500/20 rounded-lg">
                <p className="text-sm">
                  Transaction successful! Hash:{' '}
                  <a
                    href={`https://localhost:8545/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-all"
                  >
                    {transactionHash}
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Your NFTs</h2>
            {nfts.length === 0 ? (
              <div className="text-center py-8">
                <Image className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-400">No NFTs minted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    className="p-4 bg-white/5 rounded-lg border border-purple-500/30"
                  >
                    <h3 className="font-semibold text-lg mb-2">{nft.title}</h3>
                    <p className="text-sm text-gray-300 break-all">
                      URI: {nft.uri}
                    </p>
                    <p className="text-sm text-purple-400 mt-1">
                      Token ID: {nft.id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;