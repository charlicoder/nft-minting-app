// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract HelloToken is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping to store titles associated with each tokenId
    mapping(uint256 => string) private _tokenTitles;

    constructor() ERC721("HelloToken", "HTK") Ownable(msg.sender) {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }

    function safeMint(string memory uri, string memory title) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        // Store the title for the minted token
        _tokenTitles[tokenId] = title;
    }

    // Function to retrieve the title of a token
    function tokenTitle(uint256 tokenId) public view returns (string memory) {
        // require(ERC721._exists(tokenId), "Token does not exist");
        return _tokenTitles[tokenId];
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
