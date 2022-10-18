// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MhShNft is ERC721URIStorage {
  using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(address to, string memory tokenURI) public {
        uint256 currentTokenId = _tokenIds.current();
        _mint(to, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        _tokenIds.increment();
    }
}