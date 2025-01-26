# NFT Minter DApp

A decentralized application (DApp) for minting NFTs using React, Ethers.js, and Hardhat. This project allows users to connect their MetaMask wallet and mint NFTs with custom titles and IPFS URIs.

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Hardhat for local blockchain development

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd nft-minting-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the Hardhat node (in a separate terminal):
```bash
npx hardhat node
```

4. Deploy the smart contract (in a separate terminal):
```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Smart Contract

The `HelloToken` smart contract is an ERC721 implementation with the following features:

### Contract Details
- Name: HelloToken
- Symbol: HTK
- Network: Hardhat Local Network
- Contract Address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Key Functions

#### `safeMint(string memory uri, string memory title)`
Mints a new NFT with the specified URI and title.
- Parameters:
  - `uri`: IPFS URI for the NFT metadata
  - `title`: Title of the NFT
- Access: Only contract owner

#### `tokenTitle(uint256 tokenId)`
Retrieves the title of a specific token.
- Parameters:
  - `tokenId`: ID of the token
- Returns: String representing the token's title

## Using the DApp

1. **Connect Wallet**
   - Click the "Connect Wallet" button
   - Approve the MetaMask connection request
   - Ensure MetaMask is connected to the Hardhat local network (localhost:8545)

2. **Mint NFT**
   - Enter the NFT title
   - Provide the IPFS URI for your NFT metadata
   - Click "Mint NFT"
   - Approve the transaction in MetaMask
   - Wait for transaction confirmation

3. **Disconnect Wallet**
   - Click the "Disconnect" button to disconnect your wallet

## Development

### Project Structure
```
nft-minting-app/
├── src/
│   ├── contracts/    # Contract ABI and address
│   ├── hooks/        # React hooks for wallet and contract interaction
│   └── App.tsx       # Main application component
├── public/           # Static assets
└── package.json      # Project dependencies
```

### Key Features
- MetaMask wallet integration
- NFT minting functionality
- Real-time transaction status updates
- Error handling and user notifications
- Responsive design with Tailwind CSS

## Testing

To run the smart contract tests:
```bash
npx hardhat test
```

## Security Considerations

- The contract uses OpenZeppelin's implementation of ERC721
- Only the contract owner can mint NFTs
- All user inputs are validated before processing
- MetaMask handles secure key management and transaction signing

## Troubleshooting

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Verify you're connected to the Hardhat local network
   - Network details:
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `31337`

2. **Transaction Failures**
   - Check if you have enough ETH in your wallet
   - Ensure you're using the correct network
   - Verify you're the contract owner for minting

## License

MIT