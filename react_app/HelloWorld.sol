pragma solidity ^0.5.16;

contract HelloWorld {
    string public greet = "Hello World!";
    uint public digit;

    function changeUint(uint _digit) public returns(uint){
    	digit = _digit;
    	return digit;
 
    }

}
