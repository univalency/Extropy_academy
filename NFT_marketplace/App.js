import React, { Component } from "react";
import { useState } from "react";
import SimpleStorageContract from "./contracts/VolcanoToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null,
  market_cap: 0, 
  address_mint: "", 
  address_nft: "",
  url_nft: 'about:blank', 
  URIs: [],
  price: 0 , 
  price_ETH: 0,
  ID: 0, 
  nft_number: 0,
  owner: null,
  nft_creationTime: undefined,
  nft_id: null,
  nft_URI: null,
  nft_price: null,
  ID_purchase: 0,
  purchase_price: null,

};

  componentDidMount = async () => {
    try {

      this.handleMint = this.handleMint.bind(this);
      this.handleLookUp = this.handleLookUp.bind(this);
      this.handleOwnership = this.handleOwnership.bind(this);
      this.handlePurchase = this.handlePurchase.bind(this);

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance},
        //this.runExample
        );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.IdOwnerhip().call();

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.IdOwnerhip(1).call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };


/*
  handleChange(event){
    const target = event.target;
    const addr = target.type === 'text' ?
    //const nft = target.type === 'url' ?
    target.checked : target.value;
    const address = target.address;
    const nftURI = target.URI;
    const priceN = target.price;
    console.log(address)
    this.setState({
      address: addr,
      nft: nftURI,
      price: priceN,
    });
  };
*/

handleChange = (value, key) => {
    this.setState({ [key]: value });
    this.setState({price_ETH: this.state.price/10**18});
  };

 


  async handleMint(event){
    event.preventDefault();
    const {accounts, contract} = this.state;
    await contract.methods.mintToken(this.state.address_mint, this.state.url_nft, this.state.price).send({
      from: accounts[0],
    });
    var newArray = this.state.URIs.slice();    
    newArray.push(this.state.url_nft);   
    this.setState({URIs:newArray});
    this.setState({market_cap: this.state.market_cap + this.state.price/10**18})
    //const reply1 = await contract.methods.digit().call();
    //this.setState({storageValue: reply1 });
  };


  async handleLookUp(event){
    event.preventDefault();
    const {accounts, contract} = this.state;
    const nft_owner = await contract.methods.IdOwnerhip(this.state.ID).call();
    this.setState({owner: nft_owner});
  };

  async handleOwnership(event){
     event.preventDefault();
     const {accounts, contract} = this.state;
     const ownership = await contract.methods.ownershipLog(this.state.address_nft , this.state.nft_number).call();
     console.log(ownership.price);
     this.setState({
      nft_creationTime: ownership._timestamp,
      nft_id: ownership._id,
      nft_URI: ownership._URI,
      nft_price: ownership.price,
    });
  };

  async handlePurchase(event) {
     event.preventDefault();
     const {accounts, contract} = this.state;
     const address_owner = await contract.methods.IdOwnerhip(this.state.ID_purchase).call();
     const ownership = await contract.methods.ownershipLog(address_owner, 0).call();
     this.setState({purchase_price: ownership.price});
     const accountss = await window.ethereum.enable();
     //const Web3 = await getWeb3();
     await contract.methods.purchaseToken(this.state.ID_purchase, address_owner,accounts[0] ).send({
      from: accounts[0],
      value: this.state.purchase_price,
    });

  };



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Yury's obscure NFT Marketplace</h1>
        <p>Mint and look up ownerhip history</p>
        <h2>Using Pinata IPFS storage. Total market cap {this.state.market_cap}</h2>
        <p>
         
        </p>
        <p>
        
        </p>
        <div><strong>Mint a new token here:</strong></div>
        <br></br>

        <form onSubmit = {this.handleMint}>
         <label>
           address:
           <input name = "address" type = "text" value = {this.state.address_mint} onChange={event => this.handleChange(event.target.value, "address_mint")} />
          </label>
          <br />
          <label>
            URI:
            <input name = "URI" type = "url" value = {this.state.url_nft} onChange={event => this.handleChange(event.target.value, "url_nft")} />
          </label>
          <br />
          <label>
            price (in Wei):
            <input name = "price" type = "number" value = {this.state.price} onChange={event => this.handleChange(event.target.value, "price")} />
          </label>
          <p> price in ETH: {this.state.price_ETH}</p> 
          <br />
          <input type = "submit" value = "Submit"/>
        </form>
        <br></br>

        <form onSubmit = {this.handleLookUp} >
          <label>
            <p> <strong>Look up owner by token ID: </strong> &nbsp;</p>
            <input name = "Id" type = "number" value = {this.state.ID} onChange={event => this.handleChange(event.target.value, "ID")} />
            <input type = "submit" value = "Submit"/>
          </label>
        </form>

        <br></br>
        <div> Current owner: {this.state.owner} </div>

        <br></br>
        <form onSubmit = {this.handleOwnership} >
          <label>
            <p> <strong>Look up tokens owned by address: </strong> &nbsp;</p>
            <input name = "address:" type = "text" value = {this.state.address_nft} onChange={event => this.handleChange(event.target.value, "address_nft")} />
            <input name = "NFT's number:" type = "number" value = {this.state.nft_number} onChange={event => this.handleChange(event.target.value, "nft_number")} />
            <input type = "submit" value = "Submit"/>
          </label>
        </form>

        <br></br>
        <div> NFT data: 
        <p> timestamp: {this.state.nft_creationTime} </p>  
        <p> ID: {this.state.nft_id}</p> 
        <p> URI: {this.state.nft_URI} </p> 
        <p> Price: {this.state.nft_price} </p> 
        </div>

        <br></br>
        <form onSubmit = {this.handlePurchase} >
          <label>
            <p> <strong>Purchase token with id  <input name = "Id" type = "number" value = {this.state.ID_purchase} onChange={event => this.handleChange(event.target.value, "ID_purchase")} />
            </strong> &nbsp;</p>
            <input type = "submit" value = "Submit"/>
            <p> Price: {this.state.purchase_price} </p>
          </label>
        </form>


        <p> NFT minted by contract owner: </p>
        <a>
        <img src="https://gateway.pinata.cloud/ipfs/QmRXVrazywz6KFimgug5hSYHAWveZK7WiKF4ymZdtBSA7F" title="Ox's nosdrils" alt="Banana is good in taste!"/>
        </a> 


      </div>
    );
  }
}


      
          


export default App;
