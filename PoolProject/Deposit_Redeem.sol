// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Pool_Redeem {
    

    address internal _token = 0x0fC5025C764cE34df352757e82f7B5c4Df39A836;

    address depositReserve = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    
    
    //new variables (LINK randomness and other)
    bytes32 internal keyHash;
    uint256 internal fee;
    
    uint256 public randomResult;
    
    uint128 public participantCount;
    uint256 public rewardAmount;
    
    //record addresses of pool participants
    mapping(uint => address payable) poolmemberId;
    mapping(address => uint) amountsDeposited;
    
   
    constructor() {
    }
    
    function depositToPool(address payable depositor) public payable {
        require(msg.value > 0, "You must send in some ether to join the pool");
        poolmemberId[participantCount] = depositor;
        participantCount += 1;
        amountsDeposited[depositor] += msg.value;
       // payable(depositReserve).transfer(msg.value);
    }
    
    
    //return tokens to all participants
    function _redeem() public payable {
        for (uint i=0; i <= participantCount; i++) {
            poolmemberId[i].transfer(amountsDeposited[poolmemberId[i]]);
        }
    }

}
