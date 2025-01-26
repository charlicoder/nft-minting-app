import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/HelloToken';

export interface NFT {
  id: number;
  title: string;
  uri: string;
}

export function useNFTContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const validateInput = (uri: string, title: string) => {
    if (!title.trim()) {
      throw new Error('Title is required');
    }
    if (!uri.trim()) {
      throw new Error('URI is required');
    }
  };

  const mintNFT = useCallback(async (
    provider: ethers.Provider,
    uri: string,
    title: string
  ) => {
    setIsLoading(true);
    setError('');

    try {
      // Validate input
      validateInput(uri, title);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Estimate gas to check if transaction will fail
      await contract.safeMint.estimateGas(uri, title);
      
      const tx = await contract.safeMint(uri, title);
      await tx.wait();
      
      return tx.hash;
    } catch (err: any) {
      const message = err.message || 'Failed to mint NFT';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNFTs = useCallback(async (provider: ethers.Provider) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const totalSupply = await contract.totalSupply();
      const nfts: NFT[] = [];

      for (let i = 0; i < totalSupply; i++) {
        const uri = await contract.tokenURI(i);
        const title = await contract.tokenTitle(i);
        nfts.push({ id: i, title, uri });
      }

      return nfts;
    } catch (err: any) {
      const message = err.message || 'Failed to fetch NFTs';
      setError(message);
      throw new Error(message);
    }
  }, []);

  return { mintNFT, getNFTs, isLoading, error };
}