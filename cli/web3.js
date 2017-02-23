const Web3 = require('web3');
const Preferences = require('preferences');

const prefs = new Preferences('com.dapphub.dsfeeds');

const HOST = prefs.rpcUrl || "localhost";
const PORT = prefs.rpcPort || 8545;
const URL  = "http://" + HOST + ":" + PORT;
console.log("URL: ", URL);
const web3 = new Web3(this.web3 ? this.web3.currentProvider : (
  new Web3.providers.HttpProvider(URL)
));

module.exports = web3;
