const path = require("path");

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
    	return new HDWalletProvider("key",
    	"link")
    }
    }
},

  compilers: {
     solc: {
       version: "0.8.0"  // ex:  "0.4.20". (Default: Truffle's installed solc)
     }
   },
 }  
