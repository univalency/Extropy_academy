// SPDX-License-Identifier: UNLICENSED .
pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint public supply  = 10000;
    address public owner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    
    event newSupply(uint);
    
    event transferMade(uint, address);
    
    mapping (address => uint) public balances;
    
    modifier onlyOwner() {
        if (msg.sender == owner) {
            _;
        }
    }
    
    //19
    struct Payment { 
        address recipient_addr;
        uint amount_sent; 
    }
    
    //20
    mapping(address => Payment[]) public paymentsHistory;
    
    constructor() {
        balances[msg.sender] = supply;
    }
    
    
    //20
    function transfer(address _address, uint _amount) public {
        require(_amount <= balances[msg.sender], "insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_address] += _amount;
        emit transferMade(_amount,_address);
        paymentsHistory[msg.sender].push(Payment({recipient_addr: _address, amount_sent: _amount}));
    
    }
    
    function returnSupply() public returns (uint) {
        return supply;
    }
    
    function changeSupply() public onlyOwner() returns (uint){
        supply += 1000;
        emit newSupply(supply);
        return supply;
    }
    
}
