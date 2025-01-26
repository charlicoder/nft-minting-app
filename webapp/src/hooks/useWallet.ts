import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        setAddress(window.ethereum.selectedAddress);
      }
    };
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAddress(accounts[0]);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('disconnect', disconnectWallet);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('disconnect', disconnectWallet);
    };
  }, []);

  const switchToHardhatNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      });
    } catch (error: any) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x7A69', // 31337 in hex
              chainName: 'Hardhat Local Network',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:8545'],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this app');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get current network
      const network = await provider.getNetwork();
      
      // If not on Hardhat network, try to switch
      if (network.chainId !== 31337n) {
        await switchToHardhatNetwork(provider);
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      
      setAddress(account);
      setError('');
      return provider;
    } catch (err: any) {
      const message = err.code === 4001 
        ? 'Please connect your wallet to continue'
        : err.message || 'Failed to connect wallet';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress('');
    setError('');
  }, []);

  return { address, error, connectWallet, disconnectWallet };
}