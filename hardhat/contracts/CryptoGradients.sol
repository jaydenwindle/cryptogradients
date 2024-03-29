// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

struct Token {
    uint256 tokenId;
    string gradient;
    bool minted;
}

contract CryptoGradients is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(string => Token) gradientHashToToken;
    mapping(uint256 => string) tokenIdToGradient;

    string private baseURI;

    constructor(string memory baseURI_) ERC721("CryptoGradients", "CG") {
        baseURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // color must be 6 digit uppercase hex color without # prefix
    function isValidColor(string memory color) public pure returns (bool) {
        bytes memory b = bytes(color);

        // invalid hex color if not 6 chars
        if (b.length != 6) {
            return false;
        }

        for (uint256 i = 0; i < b.length; i++) {
            // invalid hex color if char is outside of range 0 - F
            if (b[i] < 0x30 || b[i] > 0x46) {
                return false;
            }

            // invalid hex color if not char is special char between 9 and A
            if (b[i] > 0x39 && b[i] < 0x41) {
                return false;
            }
        }

        return true;
    }

    function generateGradientHash(string memory color1, string memory color2)
        public
        pure
        returns (string memory)
    {
        require(isValidColor(color1), "First color is invalid");
        require(isValidColor(color2), "Second color is invalid");

        bytes memory _color1 = bytes(color1);
        bytes memory _color2 = bytes(color2);

        bytes memory gradientHash = new bytes(6);

        gradientHash[0] = _color1[0];
        gradientHash[1] = _color1[2];
        gradientHash[2] = _color1[4];
        gradientHash[3] = _color2[0];
        gradientHash[4] = _color2[2];
        gradientHash[5] = _color2[4];

        return string(gradientHash);
    }

    function getTokenForGradientHash(string memory _hash)
        public
        view
        returns (Token memory)
    {
        return gradientHashToToken[_hash];
    }

    function getGradientForTokenId(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return tokenIdToGradient[tokenId];
    }

    function mintGradient(string memory color1, string memory color2)
        public
        payable
    {
        // validate minting fee
        require(msg.value >= 0.01 ether, "Minting fee must be >=0.01 ETH");

        // make sure both colors are valid
        require(isValidColor(color1), "First color is invalid");
        require(isValidColor(color2), "Second color is invalid");

        // generate gradient hash
        string memory gradientHash = generateGradientHash(color1, color2);

        // ensure gradient hash doesn't exist
        require(
            !gradientHashToToken[gradientHash].minted,
            "This gradient already exists"
        );

        // mint token
        uint256 tokenId = _tokenIdCounter.current();
        string memory gradient = string(abi.encodePacked(color1, color2));

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uint2str(tokenId));

        // ensure gradient can't be minted twice
        gradientHashToToken[gradientHash] = Token(tokenId, gradient, true);
        // store gradient for image generation
        tokenIdToGradient[tokenId] = gradient;

        // increment token id
        _tokenIdCounter.increment();
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        str = string(bstr);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
