# NFT Minter DApp

A decentralized application (DApp) for minting NFTs using React, Ethers.js, and Hardhat. This project allows users to connect their MetaMask wallet and mint NFTs with custom titles and IPFS URIs.

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Hardhat for local blockchain development

## How to installation and run smart contract locally for development

1. Clone the repository:
```bash
git clone <your-repository-url>
cd nft-minting-app/hellonft
```

2. Install dependencies:
```bash
npm install
```

3. Start the Hardhat node (in a separate terminal):
```bash
npx hardhat node
```

4. Compile the contract:
```bash
npx hardhat compile
```

5. Set Environment variables by running following commands: (also create a .env file and set the values)
```bash
npx hardhat vars set RPC_URL
npx hardhat vars set PRIVATE_KEY
```

6. Deploy the smart contract (in a separate terminal):
```bash
npx hardhat ignition deploy ignition/modules/HelloToken.js --network <"sepolia|localhost">
```

## How to installation and run client app for development

1. Start the development server:
```bash
cd nft-minting-app/webapp
```

2. Install dependencies:
```bash
npm install
```

1. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Smart Contract

The `HelloToken` smart contract is an ERC721 implementation with the following features:

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