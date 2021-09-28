const path = require("path");

//var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {

    develop: {
      host: "127.0.0.1",
      port: 8545, 
      network_id: "1337"
    },

    rinkeby: {
    	provider: function() {
    	return new HDWalletProvider("866c50756540d92a973ca9e8558c537980ca230d3c2709d6fc2cfaa38d93c755",
    	"https://rinkeby.infura.io/v3/8104c374957244bc8d079869abac5a77")
    }
    }
  }
};
