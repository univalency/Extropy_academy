import React, { Component } from "react";
import HelloWorld from "./contracts/HelloWorld.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HelloWorld.networks[networkId];
      const instance = new web3.eth.Contract(
        HelloWorld.abi,
        deployedNetwork && deployedNetwork.address,
      );

      //adding new Rinkeby
      //instance.options.address = "0x885f1F1756C846a100dEaD67A5Adb49D3f810d40"

      //truffle
      //instance.options.address = "0x5efee1100fb3ae2d5cd58c6079e30418c7766e65"


      //Below is my ganache contract
      //instance.options.address = "0x885f1F1756C846a100dEaD67A5Adb49D3f810d40"


      //below is hello world contract address
      //instance.options.address = "0x62Ee11Cb6f6222F9Db3b3c39086EF42eF77672D0"

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

   runExample = async () => {
    const {accounts, contract} = this.state;

    //const result = {"greet": contract.greet.call()};

 //   const response = contract.methods.greet.call(function(err, res){
 //   document.getElementById('amt').innerText = res;
  //});

    const response = await contract.methods.greet().call();
    await contract.methods.changeUint(3).send({ from: accounts[0] });
    const reply = await contract.methods.digit().call();

    this.setState({ storageValue: reply});

  };
  




  /* runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  }; */

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
