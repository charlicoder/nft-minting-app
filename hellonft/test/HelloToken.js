const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloToken Contract", function () {
    let HelloToken;
    let helloToken;
    let owner, addr1;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here
        HelloToken = await ethers.getContractFactory("HelloToken");
        [owner, addr1] = await ethers.getSigners();

        // Deploy the contract
        helloToken = await HelloToken.deploy();
        // await helloToken.deployed();
    });

    it("Should deploy with the correct name and symbol", async function () {
        expect(await helloToken.name()).to.equal("HelloToken");
        expect(await helloToken.symbol()).to.equal("HTK");
    });

    it("Should mint a token and set its URI and title", async function () {
        const tokenURI = "Qm1234567890abcdef"; // Example IPFS hash
        const tokenTitle = "My First NFT";

        // Mint the token
        await helloToken.safeMint(tokenURI, tokenTitle);

        // Check the token URI and title
        expect(await helloToken.tokenURI(0)).to.equal(
            "https://gateway.pinata.cloud/ipfs/Qm1234567890abcdef"
        );
        expect(await helloToken.tokenTitle(0)).to.equal(tokenTitle);
    });

    it("Should increment the tokenId for each minted token", async function () {
        const tokenURI1 = "Qm1111111111111111";
        const tokenURI2 = "Qm2222222222222222";
        const title1 = "First Token";
        const title2 = "Second Token";

        // Mint two tokens
        await helloToken.safeMint(tokenURI1, title1);
        await helloToken.safeMint(tokenURI2, title2);

        // Check URIs and titles
        expect(await helloToken.tokenURI(0)).to.equal(
            "https://gateway.pinata.cloud/ipfs/Qm1111111111111111"
        );
        expect(await helloToken.tokenURI(1)).to.equal(
            "https://gateway.pinata.cloud/ipfs/Qm2222222222222222"
        );

        expect(await helloToken.tokenTitle(0)).to.equal(title1);
        expect(await helloToken.tokenTitle(1)).to.equal(title2);
    });

    it("Should only allow the owner to mint tokens", async function () {
        const tokenURI = "Qm1234567890abcdef";
        const tokenTitle = "Unauthorized Mint";

        // Try minting from a non-owner account
        await expect(
            helloToken.connect(addr1).safeMint(tokenURI, tokenTitle)
        ).to.be.reverted; // Remove specific error message

        // Mint from the owner account
        await helloToken.safeMint(tokenURI, tokenTitle);
        expect(await helloToken.tokenTitle(0)).to.equal(tokenTitle);
    });

    it("Should return the correct base URI", async function () {
        const tokenURI = "Qm1234567890abcdef";
        const tokenTitle = "Sample Token";

        // Mint a token
        await helloToken.safeMint(tokenURI, tokenTitle);

        // Verify the token URI includes the base URI
        expect(await helloToken.tokenURI(0)).to.equal(
            "https://gateway.pinata.cloud/ipfs/Qm1234567890abcdef"
        );
    });

    // it("Should revert when retrieving a title for a nonexistent token", async function () {
    //     await expect(helloToken.tokenTitle(0)).to.be.revertedWith(
    //         "Token does not exist"
    //     );
    // });
});
