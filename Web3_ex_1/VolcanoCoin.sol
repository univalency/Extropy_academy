// SPDX-License-Identifier: UNLICENSED .
//pragma solidity ^0.8.0;
//pragma solidity >=0.4.21 <0.7.0;
pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), Ownable {

    address public administrator;
    event newSupply(uint);
    uint public _id;
    
    event transferMade(uint, address);
    
    enum paymentTypes {Unknown,BasicPayment,Refund,Dividend,GroupPayment}
    paymentTypes choice;
    paymentTypes constant defaultChoice = paymentTypes.Unknown;
    
    //Questions 4,5,21
    constructor() onlyOwner{
        administrator = msg.sender;
        _mint(msg.sender, 10000);
        balances[msg.sender] = 10000;
    }
    
    
    struct Payment { 
        address recipient_addr;
        uint amount_sent;
        uint id;
        uint _timestamp;
        paymentTypes paymentType;
        string _comment;
     }
    
    mapping(address => Payment[]) public paymentsHistory;
    mapping(address => uint) public balances;
    
  
    
    //Q6 I think the investors will dislike this functionality since it is making money out of thin air.
    function mintMore() public onlyOwner() {
        _mint(msg.sender, totalSupply());
        
    }
    
    //Q7

    
     function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
         balances[msg.sender] -= amount;
         balances[recipient] += amount;
         paymentsHistory[msg.sender].push(Payment({
             recipient_addr: recipient, 
             amount_sent: amount,
             _timestamp: block.timestamp, 
             _comment: '', 
             id: _id, 
             paymentType: defaultChoice
         }));
        _transfer(_msgSender(), recipient, amount);
        emit Transfer(msg.sender, recipient, amount);
        _id ++;
        return true;
    }
    
    function _paymentLookUp() public view returns (Payment[] memory){
        return(paymentsHistory[msg.sender]);
        
    }
    
   // function _paymentFirst() public view returns (paymentTypes){
     //   return(paymentsHistory[msg.sender][0].paymentType);
        
    //}
    
    function _updatePayment(paymentTypes newPaymentType, string memory _newComment, uint _idTransaction) public {
        require(newPaymentType >= paymentTypes.Unknown && newPaymentType <= paymentTypes.GroupPayment, 'invlaid Payment Type');
        require(_idTransaction >= 0, 'invalid id');
        for (uint i=0; i < paymentsHistory[msg.sender].length; i++) {
            if (paymentsHistory[msg.sender][i].id == _idTransaction) {
                paymentsHistory[msg.sender][i]._comment = _newComment;
                paymentsHistory[msg.sender][i].paymentType = newPaymentType;
            }
       }
    }
    
    function _adminUpdate(paymentTypes newPaymentType, uint _idTransaction) onlyOwner public {
        for (uint i=0; i < paymentsHistory[msg.sender].length; i++) {
            if (paymentsHistory[msg.sender][i].id == _idTransaction) {
                paymentsHistory[msg.sender][i].paymentType = newPaymentType;
            }
       }
        
    }
    
     function getBalance(address addr) public view returns(uint) {
        return balances[addr];
    }
}    
