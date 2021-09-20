import Web3 from "web3";
//import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import volcanoCoinArtifact from "../../build/contracts/VolcanoCoin.json"

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = volcanoCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        volcanoCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },



  refreshBalance: async function() {
    const { getBalance } = this.meta.methods;
    const balance = await getBalance(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  
// writing backend for my tranfer function from VolcanoCoin
  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { transfer } = this.meta.methods;
    await transfer(receiver, amount).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  paymentLookUp: async function() {
    const { _paymentLookUp } = this.meta.methods;
    const log = await _paymentLookUp().call();

    const logElement = document.getElementsByClassName("log")[0];
    logElement.innerHTML = log;
    //logElement = log;

  },

  paymentUpdate: async function() {
    const newPaymentType = document.getElementById("newPaymentType").value;
    const newComment = document.getElementById("_newComment").value;
    const id  = parseInt(document.getElementById("_idTransaction").value);

    const {_updatePayment} = this.meta.methods;
    await _updatePayment(newPaymentType,newComment,id).send({ from: this.account })
    this.setStatus("Payment updated!");


  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },


};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
