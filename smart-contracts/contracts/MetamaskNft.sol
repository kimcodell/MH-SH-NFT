// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MetamaskNft is ERC721Enumerable {
    constructor() ERC721("Test NFT", "TSNT") {}

    function mintMutipleToken(uint256 applyAmount) public {
        uint256 totalSupply = totalSupply();
        for (uint256 i = 0; i < applyAmount; i++) {
            _safeMint(msg.sender, totalSupply + i);
        }
    }
}