// SPDX-License-Identifier: UNLICENSED .
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// A slight variation of the ERC721 contract. See this video for a demonstration of how this contract performs on the front end: https://youtu.be/i-z1T_hU0g8
//See App.js file to see how React was used for front end

contract VolcanoToken is ERC721('Yury Token', 'YTK'), Ownable {
    uint256 public _tokenId;
    
    mapping (address => tokenData[]) public ownershipLog;
    mapping (uint => address payable) public IdOwnerhip;
    
    struct tokenData {
        uint _timestamp;
        uint256 _id;
        string _URI;
        uint price;
    }
    
    
    function purchaseToken(uint _id, address payable _to, address payable _from) public payable {
        require(msg.sender != address(0) && msg.sender != address(this));
        require(_to == IdOwnerhip[_id], "you are not paying to the owner");
        for (uint i=0; i <=  ownershipLog[IdOwnerhip[_id]].length ; i++) {
            if (ownershipLog[IdOwnerhip[_id]][i]._id == _id) {
                uint currentPrice = ownershipLog[IdOwnerhip[_id]][i].price;
                require(msg.value >= currentPrice, "insufficient payment provided");
                //IdOwnerhip[_id].transfer(msg.value);
                _to.call{value: msg.value}("");
                ownershipLog[_from].push(ownershipLog[IdOwnerhip[_id]][i]);
                delete ownershipLog[IdOwnerhip[_id]][i];
                IdOwnerhip[_id] = _from;
                //the problem is with last line below
                break;
            } 
        }
    }


    function mintToken(address payable to, string calldata _uri, uint _price) public {
        _safeMint(to ,_tokenId);
        IdOwnerhip[_tokenId] = to;
        ownershipLog[to].push(tokenData({_timestamp : block.timestamp, _id : _tokenId, _URI : _uri, price: _price}));
        IdOwnerhip[_tokenId] = to;
        _tokenId += 1;
    }
    
    function burnToken(uint256 tokenId) private {
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
                break;
            }
        delete IdOwnerhip[tokenId];
            
        }
    }
}
