// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MhShNft is ERC721URIStorage, ERC721Enumerable {
  using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
      super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
      super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
      return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
      return super.tokenURI(tokenId);
    }

    function mint(address to, string memory tokenURI_) public {
        uint256 currentTokenId = _tokenIds.current();
        _mint(to, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI_);

        _tokenIds.increment();
    }
}