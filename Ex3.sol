// SPDX-License-Identifier: UNLICENSED .
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract VolcanoToken is ERC721('Yury Token', 'YTK'), Ownable {
    uint256 public _tokenId;
    
    mapping (address => tokenData[]) public ownershipLog;
    
    struct tokenData {
        uint _timestamp;
        uint256 _id;
        string _URI;
    }
    
    function mintToken(address to, uint256 tokenId) public {
        _safeMint(to ,tokenId);
        uint256 newId = ++ _tokenId;
        ownershipLog[to].push(tokenData({_timestamp : block.timestamp, _id : tokenId, _URI : 'new token'}));
    }
    
    function burnToken(uint256 tokenId) public {
        require (ownerOf(tokenId) == msg.sender, 'You are not the owner');
        _burn(tokenId);
        removeId(tokenId);
        
    }
    
    // I am removing Id and deleting token in the same function.
    function removeId(uint256 tokenId) public {
        for (uint i=0; i < ownershipLog[msg.sender].length; i++) {
            if (ownershipLog[msg.sender][i]._id == tokenId) {
                ownershipLog[msg.sender][i]._id = 0;
                delete ownershipLog[msg.sender][i];
                
            }
            
        }
    }
